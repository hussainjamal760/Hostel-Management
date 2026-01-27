import { Hostel } from '../hostels/hostel.model';
import { Student } from '../students/student.model';
import { HostelPayment } from '../payments/hostel-payment.model';
import { Complaint } from '../complaints/complaint.model';
import { User } from '../users/user.model';

export interface RecentActivity {
  id: string;
  type: 'user' | 'payment' | 'complaint' | 'hostel';
  message: string;
  time: string;
  createdAt: Date;
}

export interface AdminDashboardStats {
  totalHostelsOnboarded: number;
  totalActiveHostels: number;
  totalStudents: number;
  monthlyRecurringRevenue: number;
  churnedHostels: number;
  pendingPayments: number;
  pendingPaymentsAmount: number;
  flaggedHostels: number;
  recentTrends: {
    hostelsGrowth: number;
    studentsGrowth: number;
    revenueGrowth: number;
  };
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  hostelsByCity: Array<{ city: string; count: number }>;
  recentActivity: RecentActivity[];
}

export class AdminService {
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    // Parallel queries for better performance
    const [
      totalHostels,
      activeHostels,
      inactiveHostels,
      totalStudents,
      currentMonthRevenue,
      lastMonthRevenue,
      pendingPaymentsData,
      flaggedHostelsCount,
      monthlyRevenueData,
      hostelsByCityData,
      lastMonthStudents,
      recentUsers,
      recentPayments,
      recentComplaints,
      recentHostels,
    ] = await Promise.all([
      // Total hostels ever onboarded
      Hostel.countDocuments(),
      
      // Active hostels
      Hostel.countDocuments({ isActive: true }),
      
      // Inactive (churned) hostels
      Hostel.countDocuments({ isActive: false }),
      
      // Total students across platform
      Student.countDocuments({ isActive: true }),
      
      // Current month revenue (Platform Fees)
      HostelPayment.aggregate([
        {
          $match: {
            month: currentMonth,
            year: currentYear,
            status: 'COMPLETED',
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
          },
        },
      ]),
      
      // Last month revenue for comparison
      HostelPayment.aggregate([
        {
          $match: {
            month: lastMonth,
            year: lastMonthYear,
            status: 'COMPLETED',
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
          },
        },
      ]),
      
      // Pending payments (Platform Fees)
      HostelPayment.aggregate([
        {
          $match: {
            status: 'PENDING',
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            total: { $sum: '$amount' },
          },
        },
      ]),
      
      // Flagged hostels (hostels with open complaints)
      Complaint.aggregate([
        {
          $match: {
            status: { $in: ['OPEN', 'IN_PROGRESS'] },
          },
        },
        {
          $group: {
            _id: '$hostelId',
          },
        },
        {
          $count: 'count',
        },
      ]),
      
      // Monthly revenue for last 6 months (Platform Fees)
      HostelPayment.aggregate([
        {
          $match: {
            status: 'COMPLETED',
            createdAt: {
              $gte: new Date(new Date().setMonth(now.getMonth() - 6)),
            },
          },
        },
        {
          $group: {
            _id: {
              month: '$month',
              year: '$year',
            },
            revenue: { $sum: '$amount' },
          },
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 },
        },
      ]),
      
      // Hostels by city
      Hostel.aggregate([
        {
          $match: { isActive: true },
        },
        {
          $group: {
            _id: '$address.city',
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 5,
        },
      ]),
      
      // Last month students for growth calculation
      Student.countDocuments({
        isActive: true,
        createdAt: { $lt: new Date(new Date().setMonth(now.getMonth() - 1)) },
      }),

      // Recent users (last 5 registrations)
      User.find({ role: 'STUDENT' })
        .sort({ createdAt: -1 })
        .limit(3)
        .select('name createdAt')
        .lean(),

      // Recent payments (Platform Fees)
      HostelPayment.find({ status: 'COMPLETED' })
        .sort({ createdAt: -1 })
        .limit(3)
        .populate('hostelId', 'name')
        .select('amount hostelId createdAt')
        .lean(),

      // Recent complaints (last 5)
      Complaint.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .select('title createdAt')
        .lean(),

      // Recent hostels (last 5 registrations)
      Hostel.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .select('name createdAt')
        .lean(),
    ]);

    // Calculate trends
    const currentMRR = currentMonthRevenue[0]?.total || 0;
    const lastMRR = lastMonthRevenue[0]?.total || 0;
    const revenueGrowth = lastMRR > 0 ? ((currentMRR - lastMRR) / lastMRR) * 100 : 0;
    
    const studentsGrowth = lastMonthStudents > 0 
      ? ((totalStudents - lastMonthStudents) / lastMonthStudents) * 100 
      : 0;

    // Format monthly revenue
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyRevenue = monthlyRevenueData.map((item: any) => ({
      month: months[item._id.month - 1],
      revenue: item.revenue,
    }));

    // Format hostels by city
    const hostelsByCity = hostelsByCityData.map((item: any) => ({
      city: item._id || 'Unknown',
      count: item.count,
    }));

    // Format recent activity
    const recentActivity: RecentActivity[] = [];
    
    // Helper function to calculate relative time
    const getRelativeTime = (date: Date): string => {
      const now = new Date();
      const diffMs = now.getTime() - new Date(date).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} mins ago`;
      if (diffHours < 24) return `${diffHours} hours ago`;
      if (diffDays < 7) return `${diffDays} days ago`;
      return new Date(date).toLocaleDateString();
    };

    // Add user activities
    recentUsers.forEach((user: any) => {
      recentActivity.push({
        id: user._id.toString(),
        type: 'user',
        message: `New user registration: ${user.name}`,
        time: getRelativeTime(user.createdAt),
        createdAt: user.createdAt,
      });
    });

    // Add payment activities
    recentPayments.forEach((payment: any) => {
      const hostelName = payment.hostelId?.name || 'Unknown Hostel';
      recentActivity.push({
        id: payment._id.toString(),
        type: 'payment',
        message: `Payment received: PKR ${payment.amount.toLocaleString()} from ${hostelName}`,
        time: getRelativeTime(payment.createdAt),
        createdAt: payment.createdAt,
      });
    });

    // Add complaint activities
    recentComplaints.forEach((complaint: any) => {
      recentActivity.push({
        id: complaint._id.toString(),
        type: 'complaint',
        message: `New complaint filed: ${complaint.title}`,
        time: getRelativeTime(complaint.createdAt),
        createdAt: complaint.createdAt,
      });
    });

    // Add hostel activities
    recentHostels.forEach((hostel: any) => {
      recentActivity.push({
        id: hostel._id.toString(),
        type: 'hostel',
        message: `New hostel onboarded: ${hostel.name}`,
        time: getRelativeTime(hostel.createdAt),
        createdAt: hostel.createdAt,
      });
    });

    // Sort by createdAt and take top 8
    recentActivity.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const topActivity = recentActivity.slice(0, 8);

    return {
      totalHostelsOnboarded: totalHostels,
      totalActiveHostels: activeHostels,
      totalStudents,
      monthlyRecurringRevenue: currentMRR,
      churnedHostels: inactiveHostels,
      pendingPayments: pendingPaymentsData[0]?.count || 0,
      pendingPaymentsAmount: pendingPaymentsData[0]?.total || 0,
      flaggedHostels: flaggedHostelsCount[0]?.count || 0,
      recentTrends: {
        hostelsGrowth: 0,
        studentsGrowth: Math.round(studentsGrowth * 10) / 10,
        revenueGrowth: Math.round(revenueGrowth * 10) / 10,
      },
      monthlyRevenue,
      hostelsByCity,
      recentActivity: topActivity,
    };
  }

  async fixDatabase() {
    console.log('Starting DB integrity fix...');
    const Room = require('../rooms/room.model').default;
    const Student = require('../students/student.model').default;
    
    // 1. Drop the problematic index if it exists
    try {
        await Student.collection.dropIndex('roomId_1_bedNumber_1');
        console.log('Dropped index: roomId_1_bedNumber_1');
    } catch (e: any) {
        console.log('Index drop skipped/failed:', e.message);
    }

    // 2. Recalculate Room Occupancy
    const rooms = await Room.find({});
    let fixedCount = 0;
    
    for (const room of rooms) {
        const realCount = await Student.countDocuments({ roomId: room._id, isActive: true });
        if (room.occupiedBeds !== realCount) {
            console.log(`Fixing Room ${room.roomNumber}: ${room.occupiedBeds} -> ${realCount}`);
            room.occupiedBeds = realCount;
            await room.save();
            fixedCount++;
        }
    }
    
    return { 
        message: 'Database integrity check complete',
        fixedRooms: fixedCount
    };
  }
}

export default new AdminService();
