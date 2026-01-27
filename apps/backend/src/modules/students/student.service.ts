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

    // Verify actual occupancy to prevent sync issues
    const realOccupiedCount = await Student.countDocuments({ roomId: data.roomId, isActive: true });
    
    // Auto-correct if out of sync
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

    // Generate Custom Credentials
    const firstName = data.fullName.trim().split(' ')[0].toLowerCase();
    
    // CNIC is 13 digits (per updated validation), take last 3
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

      // Generate Initial Invoice
      try {
          const paymentService = require('../payments/payment.service').default;
          await paymentService.generateInitialInvoice(student, hostelId);
      } catch (invError) {
          console.error("Failed to generate initial invoice:", invError);
          // Non-blocking error? Or should we fail creation?
          // For now, log it. User can generate manually if needed.
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
      ownerId?: string; // Add ownerId to supported query params
    }
  ) {
    const { roomId, search, feeStatus, page = 1, limit = 10, ownerId } = query;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<IStudentDocument> = { isActive: true };
    
    // Logic for filtering
    if (hostelId) {
        filter.hostelId = hostelId;
    } else if (ownerId) {
        // Find all hostels for this owner
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
      // Find rooms matching the search term (requires hostel context specific handling if multi-hostel?)
      // If filtering by multiple hostels (owner view), search regex for room number should work if we rely on simple match.
      // But looking up Room ID via 'roomNumber' needs to consider multiple hostels. 
      // Current Room search logic assumed single hostelId.
      
      const orConditions: any[] = [
        { fullName: { $regex: search, $options: 'i' } },
        { fatherName: { $regex: search, $options: 'i' } }
      ];

      // If we have specific hostel context(s)
      if (filter.hostelId) {
          const matchingRooms = await Room.find({ 
            hostelId: filter.hostelId, // Can be ID or {$in: [ids]}
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
      .populate('hostelId', 'name address') // Populate Hostel info for Owner view
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
    
    // Explicitly cast to ObjectId to ensure query matches
    const student = await Student.findOne({ userId: new Types.ObjectId(userId) })
      .populate('userId', 'username email phone avatar') // Populate user details like phone
      .populate('roomId', 'roomNumber roomType')
      .exec();
      
    if (!student) {
      console.warn(`[Debug] Student profile NOT found for UserID: ${userId}`);
      // Fallback: Check if ANY student exists to verify DB connection
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

    // Handle Room/Bed Change
    if (data.roomId && data.roomId !== student.roomId.toString()) {
      // Logic for changing room
      const newRoom = await Room.findById(data.roomId);
      if (!newRoom) throw ApiError.notFound('New room not found');
      
      if (!data.bedNumber) {
          throw ApiError.badRequest('Bed number is required when changing rooms');
      }

      // Check if specific bed is occupied in new room
      const bedTaken = await Student.findOne({
          roomId: data.roomId,
          bedNumber: data.bedNumber,
          isActive: true
      });

      if (bedTaken) {
          throw ApiError.badRequest(`Bed ${data.bedNumber} in room ${newRoom.roomNumber} is already occupied`);
      }
      
      if (newRoom.occupiedBeds >= newRoom.totalBeds) {
           // Double check count, though bedTaken check should catch it mostly. 
           // Technically if data inconsistent, this safety is good.
           throw ApiError.badRequest('New room is fully occupied');
      }

      await Room.findByIdAndUpdate(student.roomId, { $inc: { occupiedBeds: -1 } });
      await Room.findByIdAndUpdate(data.roomId, { $inc: { occupiedBeds: 1 } });
    } 
    else if (data.bedNumber && data.bedNumber !== student.bedNumber) {
        // Same room, different bed
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
        // Security: Prevent Manager from updating financial fields
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
        // Soft Delete / Mark as Left
        student.isActive = false;
        student.status = 'LEFT';
        const oldRoomId = student.roomId; // Keep ref to decrement later
        student.roomId = null as any; 
        student.bedNumber = null as any;
        student.expectedLeaveDate = new Date();
        
        await student.save();
        
        // Only decrement if save succeeded!
        await Room.findByIdAndUpdate(oldRoomId, { $inc: { occupiedBeds: -1 } });
        
        return { message: 'Student marked as Left' };
    } else {
        // Hard Delete for Admin/Owner
        const oldRoomId = student.roomId;
        await Student.findByIdAndDelete(id);
        await userService.deleteUser(student.userId.toString()); 
        
        // Decrement after delete
        await Room.findByIdAndUpdate(oldRoomId, { $inc: { occupiedBeds: -1 } });
        
        return null; // 204 No Content
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
}

export default new StudentService();
