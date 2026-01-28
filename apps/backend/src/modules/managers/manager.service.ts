import Manager, { IManager } from './manager.model';
import { CreateManagerInput, UpdateManagerInput } from '@hostelite/shared-validators';
import { ApiError, hashPassword } from '../../utils';
import { User } from '../users/user.model';
import mongoose from 'mongoose';

class ManagerService {
  async createManager(data: CreateManagerInput, ownerId: string): Promise<IManager> {
    // Generate username: firstname + last 3 digits of cnic
    const firstName = data.name.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const cnicSuffix = data.cnic.slice(-3);
    let username = `${firstName}-${cnicSuffix}`;
    
    // Ensure uniqueness (simple check, append random if needed)
    let existingUser = await User.findOne({ username });
    if (existingUser) {
      username = `${username}-${Math.floor(Math.random() * 1000)}`;
    }

    const hashedPassword = await hashPassword(data.password);
    
    // Create User account
    const user = await User.create({
      name: data.name,
      email: `${username}@hostelite.local`, // Dummy email
      username: username,
      phone: data.phoneNumber,
      password: hashedPassword,
      role: 'MANAGER',
      isEmailVerified: true, 
      isFirstLogin: true, 
      isActive: true,
      hostelId: new mongoose.Types.ObjectId(data.hostelId), 
      createdBy: new mongoose.Types.ObjectId(ownerId)
    });

    const manager = await Manager.create({
      ...data,
      userId: user._id,
      ownerId: new mongoose.Types.ObjectId(ownerId),
    });

    const result = manager.toObject();
    (result as any).username = username;
    
    return result as any;
  }

  async getAllManagers(ownerId: string, hostelId?: string): Promise<IManager[]> {
    const filter: any = { 
      ownerId: new mongoose.Types.ObjectId(ownerId),
      isActive: true 
    };
    if (hostelId) {
      filter.hostelId = new mongoose.Types.ObjectId(hostelId);
    }
    return Manager.find(filter)
      .sort({ createdAt: -1 })
      .populate('userId', 'username email');
  }

  async getManagerById(id: string, ownerId: string): Promise<IManager> {
    const manager = await Manager.findOne({
      _id: id,
      ownerId: new mongoose.Types.ObjectId(ownerId),
    }).populate('userId', 'username email');

    if (!manager) {
      throw ApiError.notFound('Manager not found');
    }
    return manager;
  }

  async getManagerByUserId(userId: string): Promise<IManager> {
    const manager = await Manager.findOne({ userId }).populate('userId', 'username email');
    if (!manager) {
      throw ApiError.notFound('Manager profile not found');
    }
    return manager;
  }

  async updateManager(id: string, data: UpdateManagerInput, ownerId: string): Promise<IManager> {
    const manager = await Manager.findOneAndUpdate(
      { _id: id, ownerId: new mongoose.Types.ObjectId(ownerId) },
      data,
      { new: true, runValidators: true }
    ).populate('userId', 'username email');

    if (!manager) {
      throw ApiError.notFound('Manager not found');
    }
    return manager;
  }

  async deleteManager(id: string, ownerId: string): Promise<void> {
    const manager = await Manager.findOneAndUpdate(
      { _id: id, ownerId: new mongoose.Types.ObjectId(ownerId) },
      { isActive: false },
      { new: true }
    );

    if (!manager) {
      throw ApiError.notFound('Manager not found');
    }

    // Also deactivate the user account
    await User.findByIdAndUpdate(manager.userId, { isActive: false });
  }
}

export const managerService = new ManagerService();

