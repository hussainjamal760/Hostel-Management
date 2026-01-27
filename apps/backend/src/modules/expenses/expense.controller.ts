import { Request, Response } from 'express';
import { asyncHandler, ApiResponse, ApiError } from '../../utils';
import expenseService from './expense.service';
import { uploadToCloudinary } from '../../utils/cloudinary';

import mongoose from 'mongoose';

class ExpenseController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const { title, amount, category, date, hostelId } = req.body;
    let receiptUrl = '';

    if (!hostelId) throw ApiError.badRequest('Hostel ID is required');

    // Handle File Upload
    if (req.file) {
        try {
            const result = await uploadToCloudinary(req.file, 'hostelite/expenses');
            receiptUrl = result.url;
        } catch (error) {
            throw ApiError.internal('Failed to upload receipt');
        }
    }

    const expense = await expenseService.createExpense({
        hostelId: new mongoose.Types.ObjectId(hostelId),
        managerId: new mongoose.Types.ObjectId(req.user!.id),
        title,
        amount: Number(amount),
        category,
        date: date ? new Date(date) : new Date(),
        receiptUrl,
        status: 'PENDING'
    });

    ApiResponse.created(res, expense, 'Expense submitted successfully');
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const expenses = await expenseService.getExpenses(req.query);
    ApiResponse.paginated(res, expenses.data, expenses.pagination, 'Expenses fetched successfully');
  });

  updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
        throw ApiError.badRequest('Invalid status');
    }

    const expense = await expenseService.updateStatus(id, status, reason);
    ApiResponse.success(res, expense, `Expense ${status.toLowerCase()} successfully`);
  });

  getStats = asyncHandler(async (req: Request, res: Response) => {
    const { hostelId } = req.query;
    const stats = await expenseService.getExpenseStats(hostelId as string);
    ApiResponse.success(res, stats, 'Expense stats fetched successfully');
  });
}

export default new ExpenseController();
