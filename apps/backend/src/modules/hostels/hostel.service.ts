import { FilterQuery } from 'mongoose';
import { Hostel, IHostelDocument } from './hostel.model';
import { CreateHostelInput, UpdateHostelInput } from '@hostelite/shared-validators';
import { ApiError } from '../../utils';
import { Role } from '@hostelite/shared-types';

export class HostelService {
  async createHostel(data: CreateHostelInput, requesterId: string, requesterRole: Role) {
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

    const hostel = await Hostel.create({
      ...data,
      ownerId,
    });

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
    const { ownerId, search, city, isActive, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<IHostelDocument> = {};
    if (ownerId) filter.ownerId = ownerId;
    if (typeof isActive === 'boolean') filter.isActive = isActive;
    if (city) filter['address.city'] = { $regex: city, $options: 'i' };
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } },
      ];
    }

    const hostels = await Hostel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

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
}

export default new HostelService();
