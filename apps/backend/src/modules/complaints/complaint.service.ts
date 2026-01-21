import { FilterQuery } from 'mongoose';
import { Complaint, IComplaintDocument } from './complaint.model';
import { CreateComplaintInput, UpdateComplaintInput } from '@hostelite/shared-validators';
import { ApiError } from '../../utils';
import { Student } from '../students/student.model';
import { Role } from '@hostelite/shared-types';

export class ComplaintService {
  async createComplaint(data: CreateComplaintInput, userId: string) {
    const student = await Student.findOne({ userId });
    
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
    }
  ) {
    const { status, category, priority, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<IComplaintDocument> = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    if (role === 'STUDENT') {
      const student = await Student.findOne({ userId });
      if (!student) throw ApiError.notFound('Student profile not found');
      filter.studentId = student._id;
    } else if (role === 'MANAGER' || role === 'OWNER') {
     
    }

    if (role === 'STUDENT') {
      const student = await Student.findOne({ userId });
      if (!student) throw ApiError.notFound('Student profile not found');
      filter.studentId = student._id;
    }

    const complaints = await Complaint.find(filter)
      .populate('studentId', 'fullName roomId bedNumber')
      .populate('assignedTo', 'username role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await Complaint.countDocuments(filter);

    return {
      complaints,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
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
