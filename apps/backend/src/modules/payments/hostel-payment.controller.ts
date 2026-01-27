import { Request, Response } from 'express';
import { asyncHandler, ApiResponse, ApiError } from '../../utils';
import hostelPaymentService from './hostel-payment.service';
import { Hostel } from '../hostels/hostel.model';

export class HostelPaymentController {
    // Generate Invoice
    generateInvoice = asyncHandler(async (req: Request, res: Response) => {
        const { hostelId, month, year } = req.body;
        const result = await hostelPaymentService.generateMonthlyInvoice(hostelId, month, year);
        ApiResponse.created(res, result, 'Invoice generated successfully');
    });

    // Mark as Paid
    markAsPaid = asyncHandler(async (req: Request, res: Response) => {
        const result = await hostelPaymentService.markAsPaid(req.params.id);
        ApiResponse.success(res, result, 'Payment marked as completed');
    });

    // Update Subscription Rate
    updateRate = asyncHandler(async (req: Request, res: Response) => {
        const { hostelId } = req.params;
        const { rate } = req.body;
        
        const hostel = await Hostel.findByIdAndUpdate(hostelId, { subscriptionRate: rate }, { new: true });
        if (!hostel) {
             throw ApiError.notFound('Hostel not found');
        }
        ApiResponse.success(res, hostel, 'Subscription rate updated');
    });

    // Get Pending Payments
    getPending = asyncHandler(async (req: Request, res: Response) => {
        const { hostelId } = req.query;
        const result = await hostelPaymentService.getPendingPayments(hostelId as string);
        ApiResponse.success(res, result, 'Pending payments fetched');
    });

    // Get Admin Revenue Stats
    getAdminStats = asyncHandler(async (_req: Request, res: Response) => {
        const result = await hostelPaymentService.getAdminRevenueStats();
        ApiResponse.success(res, result, 'Admin stats fetched');
    });
}

export default new HostelPaymentController();
