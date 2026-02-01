import { FilterQuery, Types } from 'mongoose';
import { Student, IStudentDocument } from './student.model';
import { CreateStudentInput, UpdateStudentInput } from '@hostelite/shared-validators';
import { ApiError, generatePassword } from '../../utils';
import userService from '../users/user.service';
import { Room } from '../rooms/room.model';
import { User } from '../users/user.model';
import { Role } from '@hostelite/shared-types';

export class StudentService {
  async createStudent(data: CreateStudentInput, hostelId: string) {
    const room = await Room.findOne({ _id: data.roomId, hostelId });
    if (!room) {
      throw ApiError.notFound('Room not found in this hostel');
    }

    const realOccupiedCount = await Student.countDocuments({ roomId: data.roomId, isActive: true });

    if (room.occupiedBeds !== realOccupiedCount) {
      await Room.findByIdAndUpdate(data.roomId, { occupiedBeds: realOccupiedCount });
      room.occupiedBeds = realOccupiedCount;
    }

    if (room.occupiedBeds >= room.totalBeds) {
      throw ApiError.badRequest('Room is fully occupied');
    }

    const existingBed = await Student.findOne({
      roomId: data.roomId,
      bedNumber: data.bedNumber,
      isActive: true
    });

    if (existingBed) {
      throw ApiError.badRequest(`Bed ${data.bedNumber} is already occupied`);
    }

    const firstName = data.fullName.trim().split(' ')[0].toLowerCase();

    const cnicSuffix = data.cnic.slice(-3);
    const phoneSuffix = data.phone.slice(-3);
    const username = `${firstName}-${cnicSuffix}-${phoneSuffix}`;


    const { user, password } = await userService.createUser(
      {
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        role: 'STUDENT',
        hostelId,
        username,
        password: generatePassword(6),
        isEmailVerified: true,
      },
      'MANAGER',
      hostelId
    );

    try {
      const student = await Student.create({
        ...data,
        userId: user._id,
        hostelId,
      });

      await Room.findByIdAndUpdate(data.roomId, {
        $inc: { occupiedBeds: 1 }
      });

      try {
        const paymentService = require('../payments/payment.service').default;
        await paymentService.generateInitialInvoice(student, hostelId);
      } catch (invError) {
        console.error("Failed to generate initial invoice:", invError);
      }

      return { student, user, password };

    } catch (error) {
      await userService.deleteUser(user._id.toString());
      throw error;
    }
  }

  async getAllStudents(
    hostelId: string | undefined,
    query: {
      roomId?: string;
      search?: string;
      feeStatus?: string;
      page?: number;
      limit?: number;
      ownerId?: string;
    }
  ) {
    const { roomId, search, feeStatus, page = 1, limit = 10, ownerId } = query;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<IStudentDocument> = { isActive: true };

    if (hostelId) {
      filter.hostelId = hostelId;
    } else if (ownerId) {
      const Hostel = require('../hostels/hostel.model').default;
      const hostels = await Hostel.find({ ownerId, isActive: true }).select('_id');
      const hostelIds = hostels.map((h: any) => h._id);

      if (hostelIds.length > 0) {
        filter.hostelId = { $in: hostelIds };
      } else {
        return {
          students: [],
          pagination: { page, limit, total: 0, totalPages: 0, hasNext: false, hasPrev: false }
        };
      }
    }

    if (roomId) filter.roomId = roomId;
    if (feeStatus && feeStatus !== 'ALL') filter.feeStatus = feeStatus;

    if (search) {
      const orConditions: any[] = [
        { fullName: { $regex: search, $options: 'i' } },
        { fatherName: { $regex: search, $options: 'i' } }
      ];

      if (filter.hostelId) {
        const matchingRooms = await Room.find({
          hostelId: filter.hostelId,
          roomNumber: { $regex: search, $options: 'i' }
        }).select('_id');

        if (matchingRooms.length > 0) {
          orConditions.push({ roomId: { $in: matchingRooms.map(r => r._id) } });
        }
      }

      filter.$or = orConditions;
    }

    const students = await Student.find(filter)
      .populate('userId', 'username email phone avatar')
      .populate('roomId', 'roomNumber roomType')
      .populate('hostelId', 'name address')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await Student.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return {
      students,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async getStudentById(id: string) {
    const student = await Student.findById(id)
      .populate('userId', 'username email phone avatar')
      .populate('roomId', 'roomNumber roomType')
      .exec();

    if (!student) {
      throw ApiError.notFound('Student not found');
    }
    return student;
  }

  async getStudentByUserId(userId: string) {
    console.log(`[Debug] Looking for student profile for UserID: ${userId} (Type: ${typeof userId})`);

    const student = await Student.findOne({ userId: new Types.ObjectId(userId) })
      .populate('userId', 'username email phone avatar')
      .populate('roomId', 'roomNumber roomType')
      .exec();

    if (!student) {
      console.warn(`[Debug] Student profile NOT found for UserID: ${userId}`);
      const count = await Student.countDocuments();
      console.warn(`[Debug] Total students in DB: ${count}`);

      throw ApiError.notFound('Student profile not found');
    }
    console.log(`[Debug] Found Student Profile: ${student._id}`);
    return student;
  }

  async updateStudent(id: string, data: UpdateStudentInput, requesterHostelId?: string, requesterRole?: Role) {
    const student = await Student.findById(id);
    if (!student) {
      throw ApiError.notFound('Student not found');
    }

    if (requesterRole === 'MANAGER' && student.hostelId.toString() !== requesterHostelId) {
      throw ApiError.forbidden('Access denied');
    }

    if (data.roomId && data.roomId !== student.roomId.toString()) {
      const newRoom = await Room.findById(data.roomId);
      if (!newRoom) throw ApiError.notFound('New room not found');

      if (!data.bedNumber) {
        throw ApiError.badRequest('Bed number is required when changing rooms');
      }

      const bedTaken = await Student.findOne({
        roomId: data.roomId,
        bedNumber: data.bedNumber,
        isActive: true
      });

      if (bedTaken) {
        throw ApiError.badRequest(`Bed ${data.bedNumber} in room ${newRoom.roomNumber} is already occupied`);
      }

      if (newRoom.occupiedBeds >= newRoom.totalBeds) {
        throw ApiError.badRequest('New room is fully occupied');
      }

      await Room.findByIdAndUpdate(student.roomId, { $inc: { occupiedBeds: -1 } });
      await Room.findByIdAndUpdate(data.roomId, { $inc: { occupiedBeds: 1 } });
    }
    else if (data.bedNumber && data.bedNumber !== student.bedNumber) {
      const bedTaken = await Student.findOne({
        roomId: student.roomId,
        bedNumber: data.bedNumber,
        isActive: true
      });

      if (bedTaken) {
        throw ApiError.badRequest(`Bed ${data.bedNumber} is already occupied`);
      }
    }

    if (requesterRole === 'MANAGER') {
      delete (data as any).agreementDate;
      delete (data as any).monthlyFee;
      delete (data as any).securityDeposit;
      delete (data as any).feeStatus;
      delete (data as any).totalDue;
    }

    if (data.email || data.phone) {
      await User.findByIdAndUpdate(student.userId, {
        ...(data.email && { email: data.email }),
        ...(data.phone && { phone: data.phone })
      });
    }

    Object.assign(student, data);
    await student.save();
    return student;
  }

  async deleteStudent(id: string, requesterHostelId?: string, requesterRole?: Role) {
    const student = await Student.findById(id);
    if (!student) {
      throw ApiError.notFound('Student not found');
    }

    if (requesterRole === 'MANAGER' && student.hostelId.toString() !== requesterHostelId) {
      throw ApiError.forbidden('Access denied');
    }

    if (requesterRole === 'MANAGER') {
      student.isActive = false;
      student.status = 'LEFT';
      const oldRoomId = student.roomId;
      student.roomId = null as any;
      student.bedNumber = null as any;
      student.expectedLeaveDate = new Date();

      await student.save();

      await Room.findByIdAndUpdate(oldRoomId, { $inc: { occupiedBeds: -1 } });

      return { message: 'Student marked as Left' };
    } else {
      const oldRoomId = student.roomId;
      await Student.findByIdAndDelete(id);
      await userService.deleteUser(student.userId.toString());

      await Room.findByIdAndUpdate(oldRoomId, { $inc: { occupiedBeds: -1 } });

      return null;
    }
  }

  async getStudentStats(hostelId: string) {
    const activeFilter = { hostelId, isActive: true };

    const totalStudents = await Student.countDocuments(activeFilter);
    const paidStudents = await Student.countDocuments({ ...activeFilter, feeStatus: 'PAID' });
    const dueStudents = await Student.countDocuments({ ...activeFilter, feeStatus: { $in: ['DUE', 'OVERDUE', 'PARTIAL'] } });

    const financials = await Student.aggregate([
      {
        $match: {
          hostelId: new Types.ObjectId(hostelId),
          isActive: true
        }
      },
      {
        $group: {
          _id: null,
          totalCollected: {
            $sum: {
              $cond: [{ $eq: ['$feeStatus', 'PAID'] }, '$monthlyFee', 0]
            }
          },
          totalRemaining: {
            $sum: {
              $cond: [{ $ne: ['$feeStatus', 'PAID'] }, '$monthlyFee', 0]
            }
          }
        }
      }
    ]);

    const roomStats = await Room.aggregate([
      {
        $match: {
          hostelId: new Types.ObjectId(hostelId),
          isActive: true
        }
      },
      {
        $group: {
          _id: null,
          totalCapacity: { $sum: '$totalBeds' },
          currentOccupancy: { $sum: '$occupiedBeds' }
        }
      }
    ]);

    return {
      totalStudents,
      paidStudents,
      dueStudents,
      totalCollected: financials[0]?.totalCollected || 0,
      totalRemaining: financials[0]?.totalRemaining || 0,
      totalCapacity: roomStats[0]?.totalCapacity || 0,
      currentOccupancy: roomStats[0]?.currentOccupancy || 0
    };
  }

  async getDashboardAnalytics(hostelId: string) {
    const Payment = require('../payments/payment.model').default;
    const Complaint = require('../complaints/complaint.model').default;

    // 1. Action Center Counts
    const pendingPayments = await Payment.countDocuments({
      hostelId,
      paymentProof: { $exists: true, $ne: null },
      isVerified: false
    });

    const openComplaints = await Complaint.countDocuments({
      hostelId,
      status: { $in: ['OPEN', 'IN_PROGRESS'] }
    });

    // 2. Revenue Chart Data (Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1); // Start of month

    const revenueData = await Payment.aggregate([
      {
        $match: {
          hostelId: new Types.ObjectId(hostelId),
          status: 'COMPLETED',
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            month: '$month',
            year: '$year'
          },
          revenue: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Fill missing months
    const chartData = [];
    const current = new Date(sixMonthsAgo);
    const now = new Date();

    while (current <= now) {
      const m = current.getMonth() + 1;
      const y = current.getFullYear();

      const found = revenueData.find((d: any) => d._id.month === m && d._id.year === y);
      chartData.push({
        name: current.toLocaleString('default', { month: 'short' }),
        revenue: found ? found.revenue : 0,
        projected: found ? found.revenue * 1.1 : 50000 // Dummy projection logic for demo
      });

      current.setMonth(current.getMonth() + 1);
    }

    return {
      actionCenter: {
        pendingPayments,
        openComplaints
      },
      revenueChart: chartData
    };
  }

  /**
   * Get due warning information for student dashboard
   * Shows overdue challans and pending payments
   */
  async getStudentDueWarning(studentId: string): Promise<{
    hasOverdue: boolean;
    overdueCount: number;
    pendingCount: number;
    totalDueAmount: number;
    oldestDueDate: Date | null;
    challans: Array<{
      id: string;
      amount: number;
      description: string;
      dueDate: Date;
      status: string;
    }>;
  }> {
    const PaymentModel = require('../payments/payment.model').default;
    const { PAYMENT_STATUS: STATUS, PAYMENT_TYPES: TYPES } = require('@hostelite/shared-constants');

    const unpaidChallans = await PaymentModel.find({
      studentId,
      status: { $in: [STATUS.UNPAID, STATUS.OVERDUE] },
      paymentType: TYPES.RENT
    }).sort({ dueDate: 1 });

    const overdueChallans = unpaidChallans.filter((c: any) => c.status === STATUS.OVERDUE);

    return {
      hasOverdue: overdueChallans.length > 0,
      overdueCount: overdueChallans.length,
      pendingCount: unpaidChallans.length,
      totalDueAmount: unpaidChallans.reduce((sum: number, c: any) => sum + c.amount, 0),
      oldestDueDate: unpaidChallans[0]?.dueDate || null,
      challans: unpaidChallans.map((c: any) => ({
        id: c._id.toString(),
        amount: c.amount,
        description: c.description || `Monthly Rent - ${c.month}/${c.year}`,
        dueDate: c.dueDate,
        status: c.status
      }))
    };
  }
}

export default new StudentService();
