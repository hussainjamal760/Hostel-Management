import { Request, Response } from 'express';
import { asyncHandler, ApiResponse, ApiError } from '../../utils';
import complaintService from './complaint.service';
import { Role } from '@hostelite/shared-types';
import { Student } from '../students/student.model';

export class ComplaintController {
  createComplaint = asyncHandler(async (req: Request, res: Response) => {
    const result = await complaintService.createComplaint(req.body, req.user!._id);
    ApiResponse.created(res, result, 'Complaint submitted successfully');
  });

  getAllComplaints = asyncHandler(async (req: Request, res: Response) => {
    const query: any = { ...req.query };
    
    if (req.user?.role === 'MANAGER' || req.user?.role === 'OWNER') {
        if (!req.user.hostelId && req.user.role === 'MANAGER') {
            throw ApiError.badRequest('Hostel ID missing for manager');
        }
        if (req.user.role === 'MANAGER') {
             query.hostelId = req.user.hostelId;
        }
    }

    const result = await complaintService.getAllComplaints(
      req.user!._id,
      req.user!.role as Role,
      query
    );
    
    ApiResponse.paginated(res, result.complaints, result.pagination, 'Complaints fetched successfully');
  });

  getComplaintById = asyncHandler(async (req: Request, res: Response) => {
    const result = await complaintService.getComplaintById(req.params.id);
    
    if (req.user?.role === 'STUDENT') {
        const student = await Student.findOne({ userId: req.user._id });
        if (!student || result.studentId._id.toString() !== student._id.toString()) {
            throw ApiError.forbidden('Access denied');
        }
    }

    if (req.user?.role === 'MANAGER' && result.hostelId.toString() !== req.user.hostelId) {
        throw ApiError.forbidden('Access denied');
    }
    
    ApiResponse.success(res, result, 'Complaint fetched successfully');
  });

  updateComplaint = asyncHandler(async (req: Request, res: Response) => {
    const result = await complaintService.updateComplaint(req.params.id, req.body);
    ApiResponse.success(res, result, 'Complaint updated successfully');
  });

  deleteComplaint = asyncHandler(async (req: Request, res: Response) => {
    await complaintService.deleteComplaint(req.params.id);
    ApiResponse.success(res, null, 'Complaint deleted successfully');
  });
}

export default new ComplaintController();
