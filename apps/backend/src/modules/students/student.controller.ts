import { Request, Response } from 'express';
import { asyncHandler, ApiResponse, ApiError } from '../../utils';
import studentService from './student.service';
import { Role } from '@hostelite/shared-types';

export class StudentController {
  createStudent = asyncHandler(async (req: Request, res: Response) => {
    let hostelId = req.query.hostelId as string;
    
    if (req.user?.role === 'MANAGER') {
      hostelId = req.user.hostelId!;
    }

    if (!hostelId) {
      throw ApiError.badRequest('Hostel ID is required');
    }

    const result = await studentService.createStudent(req.body, hostelId);
    ApiResponse.created(res, result, 'Student registered successfully');
  });

  getAllStudents = asyncHandler(async (req: Request, res: Response) => {
    let hostelId = req.query.hostelId as string;

    if (req.user?.role === 'MANAGER') {
      hostelId = req.user.hostelId!;
    }
    
    if (!hostelId) {
       throw ApiError.badRequest('Hostel ID is required');
    }

    const result = await studentService.getAllStudents(hostelId, req.query);
    ApiResponse.paginated(res, result.students, result.pagination, 'Students fetched successfully');
  });

  getStudentById = asyncHandler(async (req: Request, res: Response) => {
    const result = await studentService.getStudentById(req.params.id);
    
    if (req.user?.role === 'MANAGER' && result.hostelId.toString() !== req.user.hostelId) {
      throw ApiError.forbidden('Access denied');
    }
    
    ApiResponse.success(res, result, 'Student fetched successfully');
  });

  getMe = asyncHandler(async (req: Request, res: Response) => {
    // Token payload uses 'id', not '_id'
    const result = await studentService.getStudentByUserId(req.user!.id);
    ApiResponse.success(res, result, 'Profile fetched successfully');
  });

  updateStudent = asyncHandler(async (req: Request, res: Response) => {
    const result = await studentService.updateStudent(
        req.params.id, 
        req.body, 
        req.user?.hostelId,
        req.user?.role as Role
    );
    ApiResponse.success(res, result, 'Student updated successfully');
  });

  deleteStudent = asyncHandler(async (req: Request, res: Response) => {
    await studentService.deleteStudent(
        req.params.id, 
        req.user?.hostelId,
        req.user?.role as Role
    );
    ApiResponse.success(res, null, 'Student deleted successfully');
  });

  getStats = asyncHandler(async (req: Request, res: Response) => {
    let hostelId = req.query.hostelId as string;
    if (req.user?.role === 'MANAGER') {
       hostelId = req.user.hostelId!;
    }
    if (!hostelId) throw ApiError.badRequest('Hostel ID is required');

    const stats = await studentService.getStudentStats(hostelId);
    ApiResponse.success(res, stats, 'Stats fetched successfully');
  });
}

export default new StudentController();
