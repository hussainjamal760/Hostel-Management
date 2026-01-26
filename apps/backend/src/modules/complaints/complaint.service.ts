import { FilterQuery, Types } from 'mongoose';
import { Complaint, IComplaintDocument } from './complaint.model';
import { CreateComplaintInput, UpdateComplaintInput } from '@hostelite/shared-validators';
import { ApiError } from '../../utils';
import { Student } from '../students/student.model';
import { Role } from '@hostelite/shared-types';

export class ComplaintService {
  async createComplaint(data: CreateComplaintInput, userId: string) {
    const student = await Student.findOne({ userId: new Types.ObjectId(userId) });
    
    if (!student) {
      throw ApiError.notFound('Student profile not found');
    }

    const complaint = await Complaint.create({
      ...data,
      studentId: student._id,
      hostelId: student.hostelId,
      status: 'OPEN'
    });

    return complaint;
  }

  async getAllComplaints(
    userId: string,
    role: Role,
    query: {
      status?: string;
      category?: string;
      priority?: string;
      page?: number;
      limit?: number;
      hostelId?: string;
    }
  ) {
    const { status, category, priority, page = 1, limit = 10, hostelId } = query;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<IComplaintDocument> = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (hostelId) filter.hostelId = hostelId;

    if (role === 'STUDENT') {
      const student = await Student.findOne({ userId: new Types.ObjectId(userId) });
      if (!student) throw ApiError.notFound('Student profile not found');
      filter.studentId = student._id;
    } else if (role === 'MANAGER') {
      filter.$or = [{ recipient: 'MANAGER' }, { recipient: 'BOTH' }];
    } else if (role === 'OWNER') {
       // Filter by Owner's hostels
       const Hostel = require('../hostels/hostel.model').default;
       const hostels = await Hostel.find({ ownerId: userId }).select('_id');
       const hostelIds = hostels.map((h: any) => h._id);
       
       if (hostelIds.length > 0) {
           filter.hostelId = { $in: hostelIds };
       } else {
           // Owner has no hostels, so no complaints
           return {
               complaints: [],
               pagination: { page, limit, total: 0, totalPages: 0, hasNext: false, hasPrev: false }
           };
       }
       // Note: Removed 'recipient' filter so Owner can oversee ALL complaints (Manager + Owner directed)
    } else if (role === 'ADMIN') {
      // Hostelite Admin sees admin directed complaints (or maybe all via query params)
      // If specific recipient filter is requested, it's handled by filter.recipient if passed?
      // But here we set default visibility.
      // Usually Admin sees all. Let's keep it open or just limit if needed.
      // Current behavior was: filter.recipient = 'ADMIN';
      // I'll make it so Admin sees ALL unless filtered.
    }

    const complaints = await Complaint.find(filter)
      .populate('studentId', 'fullName roomId bedNumber')
      .populate('hostelId', 'name address') // Added missing populate
      .populate('assignedTo', 'username role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await Complaint.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return {
      complaints,
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

  async getComplaintById(id: string) {
    const complaint = await Complaint.findById(id)
      .populate('studentId', 'fullName roomId bedNumber')
      .populate('assignedTo', 'username role')
      .exec();
      
    if (!complaint) {
      throw ApiError.notFound('Complaint not found');
    }
    return complaint;
  }

  async updateComplaint(id: string, data: UpdateComplaintInput) {
    const complaint = await Complaint.findByIdAndUpdate(id, data, { new: true });
    if (!complaint) {
      throw ApiError.notFound('Complaint not found');
    }
    return complaint;
  }

  async deleteComplaint(id: string) {
    const complaint = await Complaint.findByIdAndDelete(id);
    if (!complaint) {
      throw ApiError.notFound('Complaint not found');
    }
    return complaint;
  }
}

export default new ComplaintService();
