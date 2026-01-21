import { FilterQuery } from 'mongoose';
import { Student, IStudentDocument } from './student.model';
import { CreateStudentInput, UpdateStudentInput } from '@hostelite/shared-validators';
import { ApiError } from '../../utils';
import userService from '../users/user.service';
import { Room } from '../rooms/room.model';
import { User } from '../users/user.model';
import { Role } from '@hostelite/shared-types';

export class StudentService {
  async createStudent(data: CreateStudentInput, hostelId: string) {
    const room = await Room.findOne({ _id: data.roomId, hostelId });
    if (!room) {
      throw ApiError.notFound('Room not found in this hostel');
    }

    if (room.occupiedBeds >= room.totalBeds) {
      throw ApiError.badRequest('Room is fully occupied');
    }

    const existingBed = await Student.findOne({ 
      roomId: data.roomId, 
      bedNumber: data.bedNumber, 
      isActive: true 
    });
    
    if (existingBed) {
      throw ApiError.badRequest(`Bed ${data.bedNumber} is already occupied`);
    }

    const { user, password } = await userService.createUser(
      {
        role: 'STUDENT',
        hostelId,
      },
      'MANAGER', 
      hostelId
    );

    try {
      const student = await Student.create({
        ...data,
        userId: user._id,
        hostelId,
      });

      await Room.findByIdAndUpdate(data.roomId, {
        $inc: { occupiedBeds: 1 }
      });

      return { student, user, password };

    } catch (error) {
      await userService.deleteUser(user._id.toString());
      throw error;
    }
  }

  async getAllStudents(
    hostelId: string,
    query: {
      roomId?: string;
      search?: string;
      page?: number;
      limit?: number;
    }
  ) {
    const { roomId, search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<IStudentDocument> = { hostelId, isActive: true };
    if (roomId) filter.roomId = roomId;

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { fatherName: { $regex: search, $options: 'i' } },
      ];
    }

    const students = await Student.find(filter)
      .populate('userId', 'username email phone avatar')
      .populate('roomId', 'roomNumber roomType')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await Student.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return {
      students,
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

  async getStudentById(id: string) {
    const student = await Student.findById(id)
      .populate('userId', 'username email phone avatar')
      .populate('roomId', 'roomNumber roomType')
      .exec();
      
    if (!student) {
      throw ApiError.notFound('Student not found');
    }
    return student;
  }

  async getStudentByUserId(userId: string) {
    const student = await Student.findOne({ userId })
      .populate('roomId', 'roomNumber roomType')
      .exec();
      
    if (!student) {
      throw ApiError.notFound('Student profile not found');
    }
    return student;
  }

  async updateStudent(id: string, data: UpdateStudentInput, requesterHostelId?: string, requesterRole?: Role) {
    const student = await Student.findById(id);
    if (!student) {
      throw ApiError.notFound('Student not found');
    }

    if (requesterRole === 'MANAGER' && student.hostelId.toString() !== requesterHostelId) {
        throw ApiError.forbidden('Access denied');
    }

    if (data.roomId && data.roomId !== student.roomId.toString()) {
      const newRoom = await Room.findById(data.roomId);
      if (!newRoom) throw ApiError.notFound('New room not found');
      
      if (newRoom.occupiedBeds >= newRoom.totalBeds) {
        throw ApiError.badRequest('New room is fully occupied');
      }

      await Room.findByIdAndUpdate(student.roomId, { $inc: { occupiedBeds: -1 } });
      await Room.findByIdAndUpdate(data.roomId, { $inc: { occupiedBeds: 1 } });
    }

    Object.assign(student, data);
    await student.save();
    return student;
  }

  async deleteStudent(id: string, requesterHostelId?: string, requesterRole?: Role) {
    const student = await Student.findById(id);
    if (!student) {
      throw ApiError.notFound('Student not found');
    }

    if (requesterRole === 'MANAGER' && student.hostelId.toString() !== requesterHostelId) {
        throw ApiError.forbidden('Access denied');
    }

    if (student.isActive) {
      await Room.findByIdAndUpdate(student.roomId, { $inc: { occupiedBeds: -1 } });
    }

    student.isActive = false;
    await student.save();

    await User.findByIdAndUpdate(student.userId, { isActive: false });

    return student;
  }
}

export default new StudentService();
