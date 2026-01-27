import { HostelPayment } from './hostel-payment.model';
import { Hostel } from '../hostels/hostel.model';
import { Student } from '../students/student.model';
import { ApiError } from '../../utils';

class HostelPaymentService {
    // Generate Invoice for a Hostel
    async generateMonthlyInvoice(hostelId: string, month: number, year: number) {
        const hostel = await Hostel.findById(hostelId);
        if (!hostel) throw ApiError.notFound('Hostel not found');

        // Check if already exists
        const existing = await HostelPayment.findOne({ hostelId, month, year });
        if (existing) {
             // If pending, specific implementation logic: Update it? Or throw?
             // Lets update it with latest stats just in case
             if (existing.status === 'PENDING') {
                const activeStudentCount = await Student.countDocuments({ hostelId, isActive: true });
                const rate = hostel.subscriptionRate || 0;
                
                existing.studentCount = activeStudentCount;
                existing.ratePerStudent = rate;
                existing.amount = activeStudentCount * rate;
                await existing.save();
                return existing;
             }
             return existing; // Already paid
        }

        const activeStudentCount = await Student.countDocuments({ hostelId, isActive: true });
        const rate = hostel.subscriptionRate || 0;
        
        const invoice = await HostelPayment.create({
            hostelId,
            month,
            year,
            studentCount: activeStudentCount,
            ratePerStudent: rate,
            amount: activeStudentCount * rate,
            status: 'PENDING'
        });

        return invoice;
    }

    // Mark as Paid
    async markAsPaid(paymentId: string) {
        const payment = await HostelPayment.findById(paymentId);
        if (!payment) throw ApiError.notFound('Invoice not found');
        
        if (payment.status === 'COMPLETED') return payment;

        payment.status = 'COMPLETED';
        payment.paidAt = new Date();
        await payment.save();
        return payment;
    }

    // Get Pending Payments for a Hostel
    async getPendingPayments(hostelId?: string) {
        const filter: any = { status: 'PENDING' };
        if (hostelId) filter.hostelId = hostelId;
        return HostelPayment.find(filter).populate('hostelId', 'name').sort({ createdAt: -1 });
    }
    
    // Get Admin Dashboard Stats (New Logic)
    async getAdminRevenueStats() {
        const paid = await HostelPayment.aggregate([
            { $match: { status: 'COMPLETED' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const pending = await HostelPayment.aggregate([
             { $match: { status: 'PENDING' } },
             { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const totalRevenue = paid[0]?.total || 0;
        const totalPending = pending[0]?.total || 0;

        // Monthly Breakdown (Last 6 months)
        const monthly = await HostelPayment.aggregate([
            { 
                $match: { 
                    status: 'COMPLETED',
                    createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
                } 
            },
            {
                $group: {
                    _id: { month: '$month', year: '$year' },
                    revenue: { $sum: '$amount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        return {
            totalRevenue,
            totalPending,
            monthlyRevenue: monthly.map(m => ({
                month: new Date(0, m._id.month - 1).toLocaleString('default', { month: 'short' }),
                revenue: m.revenue
            }))
        };
    }
}

export default new HostelPaymentService();
