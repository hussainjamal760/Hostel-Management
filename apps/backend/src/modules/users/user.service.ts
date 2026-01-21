import { User } from './user.model';
import { Hostel } from '../hostels/hostel.model';
import { ApiError, generatePassword, generateAdminUsername, hashPassword } from '../../utils';
import { CreateUserInput, UpdateUserInput } from '@hostelite/shared-validators';
import { Role } from '@hostelite/shared-types';

export class UserService {
  async createUser(data: CreateUserInput, creatorRole: Role, creatorHostelId?: string) {
    if (data.role === 'ADMIN' && creatorRole !== 'ADMIN') {
      throw ApiError.forbidden('Only Admins can create other Admins');
    }

    if (data.role === 'OWNER' && creatorRole !== 'ADMIN') {
      throw ApiError.forbidden('Only Admins can create Owners');
    }

    if (data.role === 'MANAGER') {
      if (creatorRole === 'STUDENT') {
        throw ApiError.forbidden('Students cannot create Managers');
      }
      if (creatorRole !== 'ADMIN' && data.hostelId && data.hostelId !== creatorHostelId) {
        throw ApiError.forbidden('Cannot create Manager for another hostel');
      }
    }

    let username: string;
    if (data.role === 'ADMIN') {
      const count = await User.countDocuments({ role: 'ADMIN' });
      username = generateAdminUsername(count + 1);
    } else {
      const prefix = data.role.substring(0, 3).toUpperCase();
      const random = Math.floor(1000 + Math.random() * 9000);
      username = `${prefix}${random}`;
      
      let exists = await User.findOne({ username });
      while (exists) {
        const r = Math.floor(1000 + Math.random() * 9000);
        username = `${prefix}${r}`;
        exists = await User.findOne({ username });
      }
    }

    const rawPassword = generatePassword(10); 
    const hashedPassword = await hashPassword(rawPassword);

    if (data.hostelId) {
      const hostel = await Hostel.findById(data.hostelId);
      if (!hostel) {
        throw ApiError.notFound('Hostel not found');
      }
    }

    const user = await User.create({
      ...data,
      username,
      password: hashedPassword,
    });
    
    return { user, password: rawPassword }; 
  }

  async getAllUsers(
    query: {
      role?: Role;
      hostelId?: string;
      search?: string;
      page?: number;
      limit?: number;
    }
  ) {
    const { role, hostelId, search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (role) filter.role = role;
    if (hostelId) filter.hostelId = hostelId;
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await User.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return {
      users,
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

  async getUserById(id: string) {
    const user = await User.findById(id).exec();
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return user;
  }

  async updateUser(id: string, data: UpdateUserInput) {
    const user = await User.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return user;
  }

  async deleteUser(id: string) {
    const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true }).exec();
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return user;
  }
}

export default new UserService();
