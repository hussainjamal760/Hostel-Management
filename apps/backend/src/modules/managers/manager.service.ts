import Manager, { IManager } from './manager.model';
import { CreateManagerInput, UpdateManagerInput } from '@hostelite/shared-validators';
import { ApiError } from '../../utils';
import mongoose from 'mongoose';

class ManagerService {
  async createManager(data: CreateManagerInput, ownerId: string): Promise<IManager> {
    const manager = await Manager.create({
      ...data,
      ownerId: new mongoose.Types.ObjectId(ownerId),
    });
    return manager;
  }

  async getAllManagers(ownerId: string, hostelId?: string): Promise<IManager[]> {
    const filter: any = { ownerId: new mongoose.Types.ObjectId(ownerId) };
    if (hostelId) {
      filter.hostelId = new mongoose.Types.ObjectId(hostelId);
    }
    return Manager.find(filter).sort({ createdAt: -1 });
  }

  async getManagerById(id: string, ownerId: string): Promise<IManager> {
    const manager = await Manager.findOne({
      _id: id,
      ownerId: new mongoose.Types.ObjectId(ownerId),
    });

    if (!manager) {
      throw ApiError.notFound('Manager not found');
    }
    return manager;
  }

  async updateManager(id: string, data: UpdateManagerInput, ownerId: string): Promise<IManager> {
    const manager = await Manager.findOneAndUpdate(
      { _id: id, ownerId: new mongoose.Types.ObjectId(ownerId) },
      data,
      { new: true, runValidators: true }
    );

    if (!manager) {
      throw ApiError.notFound('Manager not found');
    }
    return manager;
  }

  async deleteManager(id: string, ownerId: string): Promise<void> {
    const manager = await Manager.findOneAndDelete({
      _id: id,
      ownerId: new mongoose.Types.ObjectId(ownerId),
    });

    if (!manager) {
      throw ApiError.notFound('Manager not found');
    }
  }
}

export const managerService = new ManagerService();

