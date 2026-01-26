import mongoose, { FilterQuery } from 'mongoose';
import { Hostel, IHostelDocument } from './hostel.model';
import { User } from '../users/user.model';
import { CreateHostelInput, UpdateHostelInput } from '@hostelite/shared-validators';
import { ApiError } from '../../utils';
import { Role } from '@hostelite/shared-types';

export class HostelService {
  async createHostel(data: CreateHostelInput, requesterId: string, requesterRole: Role) {
    console.log('createHostel called with:', { requesterId, requesterRole });
    
    if (data.code) {
      const existing = await Hostel.findOne({ code: data.code });
      if (existing) {
        throw ApiError.badRequest(`Hostel with code ${data.code} already exists`);
      }
    }

    let ownerId = requesterId;
    if (requesterRole === 'ADMIN' && (data as any).ownerId) {
      ownerId = (data as any).ownerId;
    }

    console.log('Creating hostel with ownerId:', ownerId);

    const hostel = await Hostel.create({
      ...data,
      ownerId,
    });

    console.log('Hostel created:', hostel._id, 'ownerId:', hostel.ownerId);

    await User.findByIdAndUpdate(ownerId, { hostelId: hostel._id });
    console.log('Updated user hostelId');

    return hostel;
  }

  async getAllHostels(
    query: {
      ownerId?: string;
      search?: string;
      city?: string;
      isActive?: boolean;
      page?: number;
      limit?: number;
    }
  ) {
    console.log('getAllHostels called with query:', query);
    
    const { ownerId, search, city, isActive = true, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<IHostelDocument> = {};
    if (ownerId) filter.ownerId = new mongoose.Types.ObjectId(ownerId);
    if (typeof isActive === 'boolean') filter.isActive = isActive;
    if (city) filter['address.city'] = { $regex: city, $options: 'i' };
    
    if (search) {
      const regex = { $regex: search, $options: 'i' };
      const searchConditions: any[] = [
         { name: regex },
         { code: regex },
         { 'address.city': regex }
      ];

      // Advanced Search: Find Owners or Managers matching the name, then filter Hostels
      // 1. Find Owners
      const owners = await User.find({ name: regex, role: 'OWNER' }).select('_id');
      if (owners.length > 0) {
          searchConditions.push({ ownerId: { $in: owners.map(o => o._id) } });
      }

      // 2. Find Managers -> Get their Hostel IDs
      const Manager = require('../managers/manager.model').default;
      const managers = await Manager.find({ name: regex }).select('hostelId');
      if (managers.length > 0) {
          searchConditions.push({ _id: { $in: managers.map((m: any) => m.hostelId) } });
      }

      filter.$or = searchConditions;
    }

    console.log('getAllHostels filter:', JSON.stringify(filter));

    const hostels = await Hostel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('ownerId', 'name phone email')
      .lean()
      .exec();

    console.log('getAllHostels found:', hostels.length, 'hostels');

    // Populate Manager and Real-time Stats manually
    const Manager = require('../managers/manager.model').default;
    const Room = require('../rooms/room.model').default;

    const hostelsWithDetails = await Promise.all(hostels.map(async (hostel: any) => {
        const manager = await Manager.findOne({ hostelId: hostel._id }).select('name phoneNumber cnic');
        
        // Real-time calculation for accuracy
        const stats = await Room.aggregate([
            { $match: { hostelId: hostel._id, isActive: true } },
            { 
                $group: { 
                    _id: '$hostelId', 
                    totalRooms: { $sum: 1 }, 
                    totalBeds: { $sum: '$totalBeds' } 
                } 
            }
        ]);
        
        const realStats = stats.length > 0 ? stats[0] : { totalRooms: 0, totalBeds: 0 };

        return { 
            ...hostel, 
            manager,
            totalRooms: realStats.totalRooms, // Override stored value
            totalBeds: realStats.totalBeds    // Override stored value
        };
    }));

    const total = await Hostel.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return {
      hostels: hostelsWithDetails,
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

  async getHostelById(id: string) {
    const hostel = await Hostel.findById(id).exec();
    if (!hostel) {
      throw ApiError.notFound('Hostel not found');
    }
    return hostel;
  }

  async updateHostel(id: string, data: UpdateHostelInput, requesterId: string, role: Role) {
    const hostel = await Hostel.findById(id);
    if (!hostel) {
      throw ApiError.notFound('Hostel not found');
    }

    if (role !== 'ADMIN' && hostel.ownerId.toString() !== requesterId) {
      throw ApiError.forbidden('You do not have permission to update this hostel');
    }

    Object.assign(hostel, data);

    // Self-healing: Fix invalid data if present (likely from legacy or bug)
    if (hostel.totalRooms < 0) hostel.totalRooms = 0;
    if (hostel.totalBeds < 0) hostel.totalBeds = 0;

    await hostel.save();

    return hostel;
  }

  async deleteHostel(id: string, requesterId: string, role: Role) {
    const hostel = await Hostel.findById(id);
    if (!hostel) {
      throw ApiError.notFound('Hostel not found');
    }

    if (role !== 'ADMIN' && hostel.ownerId.toString() !== requesterId) {
      throw ApiError.forbidden('You do not have permission to delete this hostel');
    }

    hostel.isActive = false;
    await hostel.save();

    return hostel;
  }


  async getStats(ownerId: string) {
    const hostels = await Hostel.find({ ownerId, isActive: true }).select('_id totalRooms totalBeds monthlyRent');
    const hostelIds = hostels.map(h => h._id);

    // Aggregate data
    const totalHostels = hostels.length;
    // Parallel queries for deep stats
    const Student = require('../students/student.model').default;
    const Payment = require('../payments/payment.model').default;
    const Complaint = require('../complaints/complaint.model').default;
    const Room = require('../rooms/room.model').default;

    const [
        roomStats,
        totalStudents,
        totalCollectedData,
        pendingPaymentsData,
        complaintsCount,
        monthlyRevenueData,
        currentMonthStats,
        complaintsStatusData
    ] = await Promise.all([
        Room.aggregate([
            { $match: { hostelId: { $in: hostelIds }, isActive: true } },
            { 
                $group: { 
                    _id: null, 
                    totalRooms: { $sum: 1 }, 
                    totalBeds: { $sum: '$totalBeds' } 
                } 
            }
        ]),
        Student.countDocuments({ hostelId: { $in: hostelIds }, isActive: true }),
        
        // Total Collected (Lifetime Revenue for these hostels)
        Payment.aggregate([
            { $match: { hostelId: { $in: hostelIds }, status: 'COMPLETED' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),

        // Total Remaining (Pending/Due payments for these hostels)
        // Note: This matches Payment records. If we want student dues from Student model, we'd sum student.totalDue.
        // User asked for "Total Remaining Amount" similar to Admin/Manager view which usually sums up Student Dues or Pending Invoices.
        // Let's stick to Payment model 'PENDING' for invoices, OR Student model 'totalDue' virtual/field?
        // In StudentService.getStudentStats we sum '$monthlyFee' for non-paid students.
        // Let's use Student aggregation for "Remaining" to match "Student Dues", which is more relevant for Owner.
        // But wait, the Admin dashboard used Payment collection 'PENDING'.
        // Let's use Payment PENDING for now to be consistent with "Invoices generated but not paid".
        Payment.aggregate([
             { $match: { hostelId: { $in: hostelIds }, status: 'PENDING' } },
             { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        
        Complaint.countDocuments({ hostelId: { $in: hostelIds }, status: { $in: ['OPEN', 'IN_PROGRESS'] } }),
        
        // Monthly Revenue (Last 6 Months)
        Payment.aggregate([
          {
            $match: {
              hostelId: { $in: hostelIds },
              status: 'COMPLETED',
              createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
            }
          },
          {
            $group: {
              _id: {
                month: { $month: '$createdAt' },
                year: { $year: '$createdAt' }
              },
              revenue: { $sum: '$amount' }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]),

        // Current Month Stats
        Payment.aggregate([
            {
                $match: {
                    hostelId: { $in: hostelIds },
                    month: new Date().getMonth() + 1,
                    year: new Date().getFullYear()
                }
            },
            {
                $group: {
                    _id: '$status',
                    total: { $sum: '$amount' }
                }
            }
        ]),

        // Complaints Breakdown
        Complaint.aggregate([
           { $match: { hostelId: { $in: hostelIds } } },
           { $group: { _id: '$status', count: { $sum: 1 } } }
        ])
    ]);

    const totalCollected = totalCollectedData[0]?.total || 0;
    const totalRemaining = pendingPaymentsData[0]?.total || 0;
    
    // Process Current Month Stats
    let currentMonthRevenue = 0;
    let currentMonthPending = 0;
    currentMonthStats.forEach((stat: any) => {
        if (stat._id === 'COMPLETED') currentMonthRevenue = stat.total;
        if (stat._id === 'PENDING') currentMonthPending = stat.total;
    });
    
    const realTotalRooms = roomStats[0]?.totalRooms || 0;
    const realTotalBeds = roomStats[0]?.totalBeds || 0;
    
    // Format Monthly Revenue for Chart
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyRevenue = (monthlyRevenueData as any[]).map(item => ({
        month: months[item._id.month - 1],
        revenue: item.revenue
    }));

    // Format Complaints Breakdown
    const complaintsBreakdown = {
        open: 0,
        inProgress: 0,
        resolved: 0,
        ...complaintsStatusData.reduce((acc: any, curr: any) => {
            if (curr._id === 'OPEN') acc.open = curr.count;
            if (curr._id === 'IN_PROGRESS') acc.inProgress = curr.count;
            if (curr._id === 'RESOLVED') acc.resolved = curr.count;
            return acc;
        }, {})
    };

    const occupancyRate = realTotalBeds > 0 ? Math.round((totalStudents / realTotalBeds) * 100) : 0;

    return {
      totalHostels,
      totalRooms: realTotalRooms,
      totalBeds: realTotalBeds,
      totalStudents,
      occupancyRate,
      pendingComplaints: complaintsCount,
      revenue: totalCollected,
      totalRemaining,
      monthlyRevenue,     
      complaintsBreakdown,
      currentMonthRevenue,
      currentMonthPending
    };
  }


  async getMonthlyReport(userId: string, role: string, month?: number, year?: number) {
    let hostelIds: any[] = [];
    
    if (role === 'OWNER') {
        const hostels = await Hostel.find({ ownerId: userId }).select('_id');
        hostelIds = hostels.map(h => h._id);
    } else if (role === 'MANAGER') {
        const Manager = require('../managers/manager.model').default;
        const manager = await Manager.findOne({ userId }).select('hostelId');
        if (manager && manager.hostelId) {
            hostelIds = [manager.hostelId];
        }
    }

    if (hostelIds.length === 0) {
        return {
            meta: { totalStudents: 0 },
            summary: {},
            students: []
        };
    }

    // If month/year not provided, default to current
    const targetMonth = month || new Date().getMonth() + 1;
    const targetYear = year || new Date().getFullYear();

    // 1. Get Payment Stats for the Month
    const Payment = require('../payments/payment.model').default;
    const monthlyPayments = await Payment.aggregate([
      {
        $match: {
          hostelId: { $in: hostelIds },
          month: targetMonth,
          year: targetYear
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          total: { $sum: '$amount' }
        }
      }
    ]);

    let totalRevenue = 0;

    monthlyPayments.forEach((p: any) => {
      if (p._id === 'COMPLETED') totalRevenue = p.total;
    });

    // 2. Get Student Statuses for the Month
    const Student = require('../students/student.model').default;
    const students = await Student.find({ hostelId: { $in: hostelIds }, isActive: true })
      .populate('hostelId', 'name')
      .populate('roomId', 'roomNumber')
      .populate('userId', 'phone') // Fetch student phone
      .lean();

    const studentReports = await Promise.all(students.map(async (student: any) => {
      // Find payment record for this specific month/year
      const payment = await Payment.findOne({
        studentId: student._id,
        month: targetMonth,
        year: targetYear
      }).select('status amount paidAt receiptNumber');

      return {
        studentId: student._id,
        name: student.fullName,
        contactNumber: student.userId?.phone || student.fatherPhone || '-',
        hostelName: student.hostelId?.name,
        roomNumber: student.roomId?.roomNumber,
        monthlyFee: student.monthlyFee,
        status: payment?.status || 'UNPAID',
        paidAmount: payment?.status === 'COMPLETED' ? payment.amount : 0,
        dueAmount: payment?.status === 'COMPLETED' ? 0 : (payment?.amount || student.monthlyFee),
        paymentDate: payment?.paidAt,
        receiptNumber: payment?.receiptNumber
      };
    }));

    // Recalculate Summary from actual student data for accuracy
    // This ensures students without invoices (UNPAID) are also counted in pending
    const calculatedPending = studentReports.reduce((acc, curr) => acc + curr.dueAmount, 0);

    return {
      meta: {
        month: targetMonth,
        year: targetYear,
        generatedAt: new Date(),
        totalStudents: students.length
      },
      summary: {
        totalRevenue, // Keep from Payment aggregation (most accurate for confirmed payments)
        totalPending: calculatedPending, // Use calculated pending
        collectedCount: monthlyPayments.find((p: any) => p._id === 'COMPLETED')?.count || 0,
        pendingCount: studentReports.filter(s => s.status !== 'COMPLETED').length,
      },
      students: studentReports
    };
  }
}

export default new HostelService();
