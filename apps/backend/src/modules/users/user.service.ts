import { User } from './user.model';
import { Hostel } from '../hostels/hostel.model';
import { ApiError, generatePassword, generateAdminUsername, hashPassword } from '../../utils';
import { CreateUserInput, UpdateUserInput } from '@hostelite/shared-validators';
import { Role } from '@hostelite/shared-types';

export class UserService {
  async createUser(
    data: CreateUserInput & { username?: string; password?: string; isEmailVerified?: boolean }, 
    creatorRole: Role, 
    creatorHostelId?: string
  ) {
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
    
    if (data.username) {
        // Custom username provided (e.g. for Students)
        username = data.username;
        const exists = await User.findOne({ username });
        if (exists) {
            throw ApiError.badRequest(`Username ${username} is already taken`);
        }
    } else if (data.role === 'ADMIN') {
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

    const rawPassword = data.password || generatePassword(10); 
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
      isEmailVerified: data.isEmailVerified !== undefined ? data.isEmailVerified : false
    });
    
    return { user, password: rawPassword }; 
  }

  async bulkDeleteUsers(ids: string[]) {
    await User.deleteMany({ _id: { $in: ids } });
    return { count: ids.length };
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
      const regex = { $regex: search, $options: 'i' };
      const searchConditions: any[] = [
        { username: regex },
        { email: regex },
        { name: regex },
        { phone: regex }
      ];

      // Advanced Search: Find Hostels providing context (Name, City)
      // We search Hostels matching the string, then find Users linked to them (Students/Managers via hostelId, Owners via ownerId)
      const Hostel = require('../hostels/hostel.model').default;
      const matchingHostels = await Hostel.find({
          $or: [
              { name: regex },
              { 'address.city': regex }
          ]
      }).select('_id ownerId');

      if (matchingHostels.length > 0) {
          const matchedHostelIds = matchingHostels.map((h: any) => h._id);
          const matchedOwnerIds = matchingHostels.map((h: any) => h.ownerId).filter((id: any) => !!id);

          searchConditions.push({ hostelId: { $in: matchedHostelIds } });
          searchConditions.push({ _id: { $in: matchedOwnerIds } });
      }

      filter.$or = searchConditions;
    }

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean() // Return plain JS objects to allow property addition
      .exec();

    const total = await User.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // Populate details based on role
    const usersWithDetails = await Promise.all(users.map(async (user: any) => {
        if (user.role === 'STUDENT') {
            const Student = require('../students/student.model').default;
            const studentProfile = await Student.findOne({ userId: user._id })
                .populate('hostelId', 'name address')
                .populate('roomId', 'roomNumber');
            return { ...user, profile: studentProfile };
        } else if (user.role === 'MANAGER') {
            const Manager = require('../managers/manager.model').default;
            const managerProfile = await Manager.findOne({ userId: user._id })
                .populate('hostelId', 'name address');
            return { ...user, profile: managerProfile };
        } else if (user.role === 'OWNER') {
            const Hostel = require('../hostels/hostel.model').default;
            const totalHostels = await Hostel.countDocuments({ ownerId: user._id });
            return { ...user, stats: { totalHostels } };
        }
        return user;
    }));

    return {
      users: usersWithDetails,
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
    const user = await User.findByIdAndDelete(id).exec();
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return user;
  }
}

export default new UserService();
