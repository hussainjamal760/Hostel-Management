import { FilterQuery } from 'mongoose';
import { Room, IRoomDocument } from './room.model';
import { CreateRoomInput, UpdateRoomInput } from '@hostelite/shared-validators';
import { ApiError } from '../../utils';
import { Role } from '@hostelite/shared-types';
import { Hostel } from '../hostels/hostel.model';

export class RoomService {
  async createRoom(data: CreateRoomInput, hostelId: string) {
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      throw ApiError.notFound('Hostel not found');
    }

    const existing = await Room.findOne({ hostelId, roomNumber: data.roomNumber });
    if (existing) {
      throw ApiError.badRequest(`Room ${data.roomNumber} already exists in this hostel`);
    }

    const room = await Room.create({
      ...data,
      hostelId,
    });

    await Hostel.findByIdAndUpdate(hostelId, {
      $inc: { totalRooms: 1, totalBeds: data.totalBeds }
    });

    return room;
  }

  async getAllRooms(
    hostelId: string,
    query: {
      floor?: number;
      roomType?: string;
      search?: string;
      onlyEmpty?: boolean;
      page?: number;
      limit?: number;
    }
  ) {
    const { floor, roomType, search, onlyEmpty, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<IRoomDocument> = { hostelId };
    
    if (floor !== undefined) filter.floor = floor;
    if (roomType) filter.roomType = roomType;
    if (onlyEmpty) {
      filter.$expr = { $lt: ['$occupiedBeds', '$totalBeds'] };
    }
    
    if (search) {
      filter.roomNumber = { $regex: search, $options: 'i' };
    }

    const rooms = await Room.find(filter)
      .sort({ roomNumber: 1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await Room.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return {
      rooms,
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

  async getRoomById(id: string) {
    const room = await Room.findById(id).exec();
    if (!room) {
      throw ApiError.notFound('Room not found');
    }
    return room;
  }

  async updateRoom(id: string, data: UpdateRoomInput, requesterId: string, role: Role, requesterHostelId?: string) {
    const room = await Room.findById(id);
    if (!room) {
      throw ApiError.notFound('Room not found');
    }

    const hostel = await Hostel.findById(room.hostelId);
    if (!hostel) throw ApiError.notFound('Hostel not found');

    if (role !== 'ADMIN') {
      if (role === 'OWNER' && hostel.ownerId.toString() !== requesterId) {
        throw ApiError.forbidden('Permission denied');
      }
      if (role === 'MANAGER' && room.hostelId.toString() !== requesterHostelId) {
        throw ApiError.forbidden('Permission denied');
      }
    }

    let bedDiff = 0;
    if (data.totalBeds !== undefined) {
      if (data.totalBeds < room.occupiedBeds) {
        throw ApiError.badRequest('Cannot reduce beds below occupied count');
      }
      bedDiff = data.totalBeds - room.totalBeds;
    }

    Object.assign(room, data);
    await room.save();

    if (bedDiff !== 0) {
      await Hostel.findByIdAndUpdate(room.hostelId, {
        $inc: { totalBeds: bedDiff }
      });
    }

    return room;
  }

  async deleteRoom(id: string, requesterId: string, role: Role, requesterHostelId?: string) {
    const room = await Room.findById(id);
    if (!room) {
      throw ApiError.notFound('Room not found');
    }
    
    if (room.occupiedBeds > 0) {
      throw ApiError.badRequest('Cannot delete room with occupied beds');
    }

    const hostel = await Hostel.findById(room.hostelId);
    if (!hostel) throw ApiError.notFound('Hostel not found');

    if (role !== 'ADMIN') {
      if (role === 'OWNER' && hostel.ownerId.toString() !== requesterId) {
        throw ApiError.forbidden('Permission denied');
      }
      if (role === 'MANAGER' && room.hostelId.toString() !== requesterHostelId) {
        throw ApiError.forbidden('Permission denied');
      }
    }

    room.isActive = false;
    await room.save();
    
    await Hostel.findByIdAndUpdate(room.hostelId, {
      $inc: { totalRooms: -1, totalBeds: -room.totalBeds }
    });

    return room;
  }
}

export default new RoomService();
