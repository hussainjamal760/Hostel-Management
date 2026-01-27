import { Expense, IExpenseDocument } from './expense.model';
import { ApiError } from '../../utils';
import mongoose, { FilterQuery } from 'mongoose';

class ExpenseService {
  async createExpense(data: Partial<IExpenseDocument>) {
    return await Expense.create(data);
  }

  async getExpenses(query: any) {
    const { hostelId, status, startDate, endDate, category, limit = 50, page = 1 } = query;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<IExpenseDocument> = {};
    if (hostelId) filter.hostelId = hostelId;
    if (status) filter.status = status;
    if (category) filter.category = category;
    
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
        filter.date = { $gte: new Date(startDate) };
    }

    const expenses = await Expense.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('managerId', 'name')
      .populate('hostelId', 'name');

    const total = await Expense.countDocuments(filter);

    const totalPages = Math.ceil(total / limit);
    const currentPage = Number(page);

    return {
      data: expenses,
      pagination: {
        total,
        page: currentPage,
        limit: Number(limit),
        totalPages,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1
      }
    };
  }

  async updateStatus(id: string, status: 'APPROVED' | 'REJECTED', reason?: string) {
    const expense = await Expense.findById(id);
    if (!expense) throw ApiError.notFound('Expense not found');

    if (expense.status !== 'PENDING') {
        throw ApiError.badRequest('Can only update status of PENDING expenses');
    }

    expense.status = status;
    if (status === 'REJECTED' && reason) {
        expense.rejectionReason = reason;
    }

    return await expense.save();
  }

  async getExpenseStats(hostelId?: string) {
    const matchStage: any = {};
    if (hostelId && hostelId !== 'ALL') {
        matchStage.hostelId = new mongoose.Types.ObjectId(hostelId);
    }

    const stats = await Expense.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: '$status',
                totalAmount: { $sum: '$amount' },
                count: { $sum: 1 }
            }
        }
    ]);

    // Format for easier consumption
    const result = {
        totalPending: 0,
        totalApproved: 0,
        totalRejected: 0,
        pendingCount: 0,
        approvedCount: 0,
        rejectedCount: 0
    };

    stats.forEach(s => {
        if (s._id === 'PENDING') { result.totalPending = s.totalAmount; result.pendingCount = s.count; }
        if (s._id === 'APPROVED') { result.totalApproved = s.totalAmount; result.approvedCount = s.count; }
        if (s._id === 'REJECTED') { result.totalRejected = s.totalAmount; result.rejectedCount = s.count; }
    });

    return result;
  }
}

export default new ExpenseService();
