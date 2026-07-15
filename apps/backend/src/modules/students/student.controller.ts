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
    let hostelId = typeof req.query.hostelId === 'string' ? req.query.hostelId : '';
    const query: any = {};
    if (typeof req.query.roomId === 'string') query.roomId = req.query.roomId;
    if (typeof req.query.search === 'string') query.search = req.query.search;
    if (typeof req.query.feeStatus === 'string') query.feeStatus = req.query.feeStatus;
    if (typeof req.query.page === 'string') query.page = Number(req.query.page);
    if (typeof req.query.limit === 'string') query.limit = Number(req.query.limit);

    if (req.user?.role === 'MANAGER') {
      hostelId = req.user.hostelId!;
    } else if (req.user?.role === 'OWNER') {
      query.ownerId = req.user.id;
    }

    if (!hostelId && req.user?.role !== 'OWNER' && req.user?.role !== 'ADMIN') {
      throw ApiError.badRequest('Hostel ID is required');
    }

    const result = await studentService.getAllStudents(hostelId, query);
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

  getAnalytics = asyncHandler(async (req: Request, res: Response) => {
    let hostelId = req.query.hostelId as string;
    if (req.user?.role === 'MANAGER') {
      hostelId = req.user.hostelId!;
    }
    if (!hostelId) throw ApiError.badRequest('Hostel ID is required');

    const analytics = await studentService.getDashboardAnalytics(hostelId);
    ApiResponse.success(res, analytics, 'Analytics fetched successfully');
  });

  /**
   * Get due warning for logged-in student
   * Returns overdue challan information for dashboard display
   */
  getDueWarning = asyncHandler(async (req: Request, res: Response) => {
    // Get student profile from user ID
    const student = await studentService.getStudentByUserId(req.user!.id);

    const warning = await studentService.getStudentDueWarning(student._id.toString());
    ApiResponse.success(res, warning, 'Due warning fetched successfully');
  });

  resendActivation = asyncHandler(async (req: Request, res: Response) => {
    const studentId = req.params.id;
    let hostelId = req.query.hostelId as string;
    
    if (req.user?.role === 'MANAGER') {
      hostelId = req.user.hostelId!;
    }
    
    if (!hostelId) {
      throw ApiError.badRequest('Hostel ID is required');
    }

    const student = await studentService.getStudentById(studentId);
    
    if (req.user?.role === 'MANAGER' && student.hostelId.toString() !== req.user.hostelId) {
      throw ApiError.forbidden('Access denied');
    }

    const User = require('../users/user.model').default;
    const user = await User.findById(student.userId).select('+activationToken').exec();

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    if (!user.activationToken) {
      throw ApiError.badRequest('Student is already activated');
    }

    const env = require('../../config/env').default;
    const mailService = require('../../utils/mail.service').mailService;
    const activationLink = `${env.FRONTEND_URL}/student/activate?token=${user.activationToken}`;
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #8b5e34; text-align: center;">Welcome to your Hostel!</h2>
        <p>Hello ${student.fullName},</p>
        <p>Your student account activation link is here. Please click the button below to set your password and activate your account:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${activationLink}" style="padding: 12px 24px; background-color: #8b5e34; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Activate Account</a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
        <p style="background-color: #fdf8f5; padding: 10px; border-radius: 4px; font-size: 14px; word-break: break-all; border: 1px solid #e8dcc8;">${activationLink}</p>
        <p>This link will expire in 24 hours.</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="font-size: 12px; color: #6b7280; text-align: center;">&copy; ${new Date().getFullYear()} Hostel Management System. All rights reserved.</p>
      </div>
    `;

    await mailService.sendEmail({
      to: user.email,
      subject: 'Activate Your Student Account',
      html: emailHtml
    });

    ApiResponse.success(res, { activationToken: user.activationToken }, 'Activation email resent successfully');
  });
}

export default new StudentController();
