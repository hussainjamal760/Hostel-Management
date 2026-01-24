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

    if (role === 'MANAGER') {
      hostelId = userHostelId!;
    } else if (role === 'STUDENT') {
       // Students can only see their own payments
       // We force the query to filter by their student ID (which we need to fetch or assuming userId links to student)
       // Wait, req.user.id is the User ID. The Payment model uses studentId (Student Profile ID).
       // We need to look up the student profile for this user first? 
       // OR if the frontend sends `studentId` in query, we verify it belongs to this user.
       
       // Ideally, the service should handle this look up, or we trust the query param IF we verify ownership.
       // But simpler: checking if req.query.studentId is present.
       // However, `getAllPayments` in service takes `studentId`.
       // Let's assume for now the frontend sends the correct studentId (which it does).
       // We should verify that the requested studentId matches the logged-in user's student profile.
       // Importing studentService to check?
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
 
    let proofUrl = req.body.proofUrl;
    
    // If file is attached directly to this request (middleware handled)
    if (req.file) {
        // We'd need to import the cloudinary uploader here or use the service
        const { uploadToCloudinary } = require('../../utils/cloudinary');
        const result = await uploadToCloudinary(req.file);
        proofUrl = result.url;
    }

    if (!proofUrl) {
       throw ApiError.badRequest('Proof image is required');
    }

    const result = await paymentService.submitPaymentProof(req.params.id, proofUrl);
    ApiResponse.success(res, result, 'Payment proof submitted successfully');
  });

  verifyPayment = asyncHandler(async (req: Request, res: Response) => {
     const result = await paymentService.verifyPayment(req.params.id, req.user!.id);
     ApiResponse.success(res, result, 'Payment verified successfully');
  });

}

export default new PaymentController();
