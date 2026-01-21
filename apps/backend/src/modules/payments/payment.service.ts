import { FilterQuery } from 'mongoose';
import { Payment, IPaymentDocument } from './payment.model';
import { CreatePaymentInput, UpdatePaymentInput } from '@hostelite/shared-validators';
import { ApiError } from '../../utils';
import { Student } from '../students/student.model';
import { Role } from '@hostelite/shared-types';

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

    const payment = await Payment.create({
      ...data,
      hostelId: student.hostelId,
      collectedBy,
      receiptNumber,
      status: 'COMPLETED', 
      paidAt: new Date()
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
    if (month) filter.month = month;
    if (year) filter.year = year;

    const payments = await Payment.find(filter)
      .populate('studentId', 'fullName roomId bedNumber')
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
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
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
}

export default new PaymentService();
