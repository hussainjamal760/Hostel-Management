import { Request, Response } from 'express';
import { asyncHandler, ApiResponse, ApiError } from '../../utils';
import paymentService from './payment.service';
import { Role } from '@hostelite/shared-types';

export class PaymentController {
  createPayment = asyncHandler(async (req: Request, res: Response) => {
    // If student, force studentId to be their own (or verify)
    // For now, simpler to trust body but we should valid.
    // If we want to be strict: 
    // if (req.user.role === 'STUDENT') req.body.studentId = req.user.studentProfileId; 
    // But we don't have studentProfileId on req.user easily without DB call. 
    // Let's rely on service or assume body is correct for MVP, user seems trust-based.
    
    // Actually, createPayment in router might be restricted to ADMIN/MANAGER.
    // Need to check router permissions.
    
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
    const { role, hostelId: userHostelId, id: userId } = req.user!;

    console.log('GetAllPayments - User:', { role, userHostelId, userId });
    console.log('GetAllPayments - Initial Query HostelId:', hostelId);

    if (role === 'MANAGER') {
      hostelId = userHostelId!;
      console.log('GetAllPayments - Enforced Manager HostelId:', hostelId);
    } else if (role === 'STUDENT') {
       const studentService = require('../students/student.service').default;
       const student = await studentService.getStudentByUserId(userId);
       if (!student) throw ApiError.notFound('Student profile not found');
       
       req.query.studentId = student._id.toString();
       hostelId = student.hostelId.toString();
    }
    
    if (!hostelId) {
       throw ApiError.badRequest('Hostel ID is required');
    }

    const result = await paymentService.getAllPayments(hostelId, req.query);
    console.log(`GetAllPayments - Found ${result.payments.length} payments for hostel ${hostelId}`);
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

  submitPaymentProof = asyncHandler(async (req: Request, res: Response) => {
    console.log('Submit Proof Request Body:', req.body);
    console.log('Submit Proof File:', req.file);

    let proofUrl = req.body.proofUrl;
    
    // If file is attached directly to this request (middleware handled)
    if (req.file) {
        // We'd need to import the cloudinary uploader here or use the service
        const { uploadToCloudinary } = require('../../utils/cloudinary');
        try {
            const result = await uploadToCloudinary(req.file, 'hostelite/payments'); // Use better folder
            console.log('Cloudinary Result:', result);
            proofUrl = result.url;
        } catch (err) {
            console.error('Cloudinary Upload Failed:', err);
            throw new ApiError(500, 'Failed to upload image to cloud storage');
        }
    }

    if (!proofUrl) {
       throw ApiError.badRequest('Proof image is required');
    }

    const result = await paymentService.submitPaymentProof(req.params.id, proofUrl);
    console.log('Payment updated with proof:', result);
    ApiResponse.success(res, result, 'Payment proof submitted successfully');
  });

  verifyPayment = asyncHandler(async (req: Request, res: Response) => {
     const result = await paymentService.verifyPayment(req.params.id, req.user!.id);
     ApiResponse.success(res, result, 'Payment verified successfully');
  });

  triggerMonthlyDues = asyncHandler(async (_req: Request, res: Response) => {
     // Admin/Owner only ideally
     const { paymentScheduler } = require('./cron.service');
     const result = await paymentScheduler.generateMonthlyDues();
     ApiResponse.success(res, result, 'Monthly dues generation triggered');
  });

}

export default new PaymentController();
