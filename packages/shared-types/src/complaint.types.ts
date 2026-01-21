import { Types } from 'mongoose';

/**
 * Complaint Types
 * Grievance/Complaint entity and related types
 */

export type ComplaintCategory =
  | 'MAINTENANCE'
  | 'FOOD'
  | 'SECURITY'
  | 'CLEANLINESS'
  | 'OTHER';

export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ComplaintStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface IComplaint {
  _id: string;
  studentId: Types.ObjectId | string;
  hostelId: Types.ObjectId | string;

  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;

  status: ComplaintStatus;

  attachments?: string[];

  assignedTo?: Types.ObjectId | string;
  resolution?: string;
  resolvedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface IComplaintCreate {
  title: string;
  description: string;
  category: ComplaintCategory;
  priority?: ComplaintPriority;
  attachments?: string[];
}

export interface IComplaintUpdate {
  status?: ComplaintStatus;
  priority?: ComplaintPriority;
  assignedTo?: string;
  resolution?: string;
  resolvedAt?: Date;
}
