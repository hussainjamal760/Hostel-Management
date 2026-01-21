import { Request, Response } from 'express';
import { asyncHandler, ApiResponse, ApiError } from '../../utils';
import paymentService from './payment.service';
import { Role } from '@hostelite/shared-types';

export class PaymentController {
  createPayment = asyncHandler(async (req: Request, res: Response) => {
    const result = await paymentService.createPayment(
        req.body, 
        req.user!._id,
        req.user?.hostelId,
        req.user?.role as Role
    );
    ApiResponse.created(res, result, 'Payment recorded successfully');
  });

  getAllPayments = asyncHandler(async (req: Request, res: Response) => {
    let hostelId = req.query.hostelId as string;

    if (req.user?.role === 'MANAGER') {
      hostelId = req.user.hostelId!;
    }
    
    if (!hostelId) {
       throw ApiError.badRequest('Hostel ID is required');
    }

    const result = await paymentService.getAllPayments(hostelId, req.query);
    ApiResponse.paginated(res, result.payments, result.pagination, 'Payments fetched successfully');
  });

  getPaymentById = asyncHandler(async (req: Request, res: Response) => {
    const result = await paymentService.getPaymentById(req.params.id);
    
    if (req.user?.role === 'MANAGER' && result.hostelId.toString() !== req.user.hostelId) {
      throw ApiError.forbidden('Access denied');
    }
    
    ApiResponse.success(res, result, 'Payment fetched successfully');
  });

  updatePayment = asyncHandler(async (req: Request, res: Response) => {
    const result = await paymentService.updatePayment(req.params.id, req.body);
    ApiResponse.success(res, result, 'Payment updated successfully');
  });
}

export default new PaymentController();
