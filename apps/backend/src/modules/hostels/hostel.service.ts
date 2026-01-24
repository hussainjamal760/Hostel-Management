import mongoose, { FilterQuery } from 'mongoose';
import { Hostel, IHostelDocument } from './hostel.model';
import { User } from '../users/user.model';
import { CreateHostelInput, UpdateHostelInput } from '@hostelite/shared-validators';
import { ApiError } from '../../utils';
import { Role } from '@hostelite/shared-types';

export class HostelService {
  async createHostel(data: CreateHostelInput, requesterId: string, requesterRole: Role) {
    console.log('createHostel called with:', { requesterId, requesterRole });
    
    if (data.code) {
      const existing = await Hostel.findOne({ code: data.code });
      if (existing) {
        throw ApiError.badRequest(`Hostel with code ${data.code} already exists`);
      }
    }

    let ownerId = requesterId;
    if (requesterRole === 'ADMIN' && (data as any).ownerId) {
      ownerId = (data as any).ownerId;
    }

    console.log('Creating hostel with ownerId:', ownerId);

    const hostel = await Hostel.create({
      ...data,
      ownerId,
    });

    console.log('Hostel created:', hostel._id, 'ownerId:', hostel.ownerId);

    await User.findByIdAndUpdate(ownerId, { hostelId: hostel._id });
    console.log('Updated user hostelId');

    return hostel;
  }

  async getAllHostels(
    query: {
      ownerId?: string;
      search?: string;
      city?: string;
      isActive?: boolean;
      page?: number;
      limit?: number;
    }
  ) {
    console.log('getAllHostels called with query:', query);
    
    const { ownerId, search, city, isActive = true, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<IHostelDocument> = {};
    if (ownerId) filter.ownerId = new mongoose.Types.ObjectId(ownerId);
    if (typeof isActive === 'boolean') filter.isActive = isActive;
    if (city) filter['address.city'] = { $regex: city, $options: 'i' };
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } },
      ];
    }

    console.log('getAllHostels filter:', JSON.stringify(filter));

    const hostels = await Hostel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    console.log('getAllHostels found:', hostels.length, 'hostels');

    const total = await Hostel.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return {
      hostels,
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

  async getHostelById(id: string) {
    const hostel = await Hostel.findById(id).exec();
    if (!hostel) {
      throw ApiError.notFound('Hostel not found');
    }
    return hostel;
  }

  async updateHostel(id: string, data: UpdateHostelInput, requesterId: string, role: Role) {
    const hostel = await Hostel.findById(id);
    if (!hostel) {
      throw ApiError.notFound('Hostel not found');
    }

    if (role !== 'ADMIN' && hostel.ownerId.toString() !== requesterId) {
      throw ApiError.forbidden('You do not have permission to update this hostel');
    }

    Object.assign(hostel, data);

    // Self-healing: Fix invalid data if present (likely from legacy or bug)
    if (hostel.totalRooms < 0) hostel.totalRooms = 0;
    if (hostel.totalBeds < 0) hostel.totalBeds = 0;

    await hostel.save();

    return hostel;
  }

  async deleteHostel(id: string, requesterId: string, role: Role) {
    const hostel = await Hostel.findById(id);
    if (!hostel) {
      throw ApiError.notFound('Hostel not found');
    }

    if (role !== 'ADMIN' && hostel.ownerId.toString() !== requesterId) {
      throw ApiError.forbidden('You do not have permission to delete this hostel');
    }

    hostel.isActive = false;
    await hostel.save();

    return hostel;
  }


  async getStats(ownerId: string) {
    const hostels = await Hostel.find({ ownerId, isActive: true });
    
    // Aggregate data
    const totalHostels = hostels.length;
    const totalRooms = hostels.reduce((acc, hostel) => acc + hostel.totalRooms, 0);
    const totalBeds = hostels.reduce((acc, hostel) => acc + hostel.totalBeds, 0);
    
    // In a real app, we would query other collections (Students, Complaints) here
    // For now, we'll return the hostel data and some placeholders
    return {
      totalHostels,
      totalRooms,
      totalBeds,
      totalStudents: 0, // Placeholder
      occupancyRate: 0, // Placeholder
      pendingComplaints: 0, // Placeholder
      revenue: hostels.reduce((acc, hostel) => acc + (hostel.monthlyRent * (hostel.totalBeds || 0) * 0.8), 0), // Est. Revenue
    };
  }
}

export default new HostelService();
