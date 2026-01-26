import { FilterQuery } from 'mongoose';
import { Payment, IPaymentDocument } from './payment.model';
import { CreatePaymentInput, UpdatePaymentInput } from '@hostelite/shared-validators';
import { ApiError } from '../../utils';
import { Student } from '../students/student.model';
import { Role } from '@hostelite/shared-types';
import { PAYMENT_STATUS, PAYMENT_TYPES, PAYMENT_METHODS } from '@hostelite/shared-constants';

export class PaymentService {
  async createPayment(data: CreatePaymentInput, collectedBy: string, requesterHostelId?: string, requesterRole?: Role) {
    const student = await Student.findById(data.studentId);
    if (!student) {
      throw ApiError.notFound('Student not found');
    }

    if (requesterRole === 'MANAGER' && student.hostelId.toString() !== requesterHostelId) {
        throw ApiError.forbidden('Access denied');
    }

    const date = new Date();
    const random = Math.floor(1000 + Math.random() * 9000);
    const receiptNumber = `PAY-${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}-${random}`;

    // If manual creation by manager, default to PAID/COMPLETED
    // If student, they shouldn't trigger this directly anymore ideally, but if so, PENDING
    const status = (requesterRole === 'STUDENT') ? PAYMENT_STATUS.PENDING : PAYMENT_STATUS.COMPLETED;
    const isVerified = status === PAYMENT_STATUS.COMPLETED;
    
    // Check if duplicate for month+year? Maybe not for manual extra payments.
    
    const payment = await Payment.create({
      ...data,
      hostelId: student.hostelId,
      collectedBy: (requesterRole === 'STUDENT') ? null : collectedBy, // Students don't "collect"
      receiptNumber,
      status,
      isVerified,
      paymentProof: (data as any).paymentProof, // Ensure this is saved if passed
      paidAt: status === PAYMENT_STATUS.COMPLETED ? new Date() : undefined
    });

    return payment;
  }

  async getAllPayments(
    hostelId: string,
    query: {
      studentId?: string;
      status?: string;
      month?: number;
      year?: number;
      page?: number;
      limit?: number;
    }
  ) {
    const { studentId, status, month, year, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<IPaymentDocument> = { hostelId };
    
    if (studentId) filter.studentId = studentId;
    if (status) filter.status = status;
    if (month) filter.month = Number(month); // Ensure number
    if (year) filter.year = Number(year);

    const payments = await Payment.find(filter)
      .populate({
        path: 'studentId',
        select: 'fullName roomId bedNumber',
        populate: {
          path: 'roomId',
          select: 'roomNumber',
        },
      })
      .populate('collectedBy', 'username role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await Payment.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return {
      payments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages,
        hasNext: Number(page) < totalPages,
        hasPrev: Number(page) > 1,
      },
    };
  }

  async getPaymentById(id: string) {
    const payment = await Payment.findById(id)
      .populate('studentId', 'fullName roomId bedNumber')
      .populate('collectedBy', 'username role')
      .exec();
      
    if (!payment) {
      throw ApiError.notFound('Payment not found');
    }
    return payment;
  }

  async updatePayment(id: string, data: UpdatePaymentInput) {
    const payment = await Payment.findByIdAndUpdate(id, data, { new: true });
    if (!payment) {
      throw ApiError.notFound('Payment not found');
    }
    return payment;
  }

  async submitPaymentProof(paymentId: string, proofUrl: string) {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw ApiError.notFound('Payment not found');
    }

    if (payment.status === PAYMENT_STATUS.COMPLETED) {
      throw ApiError.badRequest('Payment is already completed');
    }

    payment.paymentProof = proofUrl;
    // Update status to PENDING (Verification Pending)
    payment.status = PAYMENT_STATUS.PENDING; 
    
    await payment.save();
    return payment;
  }

  async verifyPayment(paymentId: string, verifierId: string) {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw ApiError.notFound('Payment not found');
    }

    if (payment.status === PAYMENT_STATUS.COMPLETED) {
      throw ApiError.badRequest('Payment is already verified');
    }

    payment.status = PAYMENT_STATUS.COMPLETED;
    payment.isVerified = true;
    payment.verifiedBy = verifierId;
    payment.verifiedAt = new Date();
    payment.paidAt = new Date();
    payment.collectedBy = verifierId; 
    
    await payment.save();

    // Auto-update Student Status
    try {
        // We only switch student to PAID if they have NO other overdue payments?
        // Or simpler: If they pay this month's rent, they are "Paid" for this month. 
        // But what about defaults? 
        // Logic: if all past invoices are PAID, then PAID.
        // For MVP per request "Reflect in defaulter revenue chart", we just let front-end calculate "Active Defaulter" status.
        // But we update `feeStatus` for visual nicety.
        
        await Student.findByIdAndUpdate(payment.studentId, {
            feeStatus: 'PAID', // This assumes paying ANY invoice makes them paid? Probably weak logic.
            // Better: Don't rely on 'feeStatus' string on student model anymore. Rely on Invoice status.
            // But for compatibility with existing UI that reads student.feeStat
            lastPaymentDate: new Date()
        });
    } catch (error) {
        console.error('Failed to update student status:', error);
    }

    return payment;
  }

  async generateInitialInvoice(student: any, hostelId: string) {
    const totalAmount = (student.monthlyFee || 0) + (student.securityDeposit || 0);
    
    if (totalAmount <= 0) return null; // Nothing to bill

    const date = new Date();
    const random = Math.floor(1000 + Math.random() * 9000);
    const receiptNumber = `INV-${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}-${random}`;
    
    const payment = await Payment.create({
      studentId: student._id,
      hostelId,
      amount: totalAmount,
      paymentType: PAYMENT_TYPES.RENT,
      paymentMethod: PAYMENT_METHODS.CASH, // Default for generated invoice
      status: PAYMENT_STATUS.PENDING,
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      dueDate: new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
      receiptNumber,
      isVerified: false,
      description: `Initial Invoice: Monthly Fee (${student.monthlyFee}) + Security Deposit (${student.securityDeposit})`
    });

    console.log(`Generated Initial Invoice for ${student.fullName}: ${payment.receiptNumber}`);
    return payment;
  }
}

export default new PaymentService();
