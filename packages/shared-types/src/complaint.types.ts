export type ComplaintStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ComplaintCategory =
  | 'MAINTENANCE'
  | 'FOOD'
  | 'SECURITY'
  | 'CLEANLINESS'
  | 'OTHER';

export type ComplaintRecipient = 'MANAGER' | 'OWNER' | 'BOTH' | 'ADMIN';

import { IStudent } from './student.types';

export interface IComplaint {
  _id: string;
  studentId: string | IStudent;
  hostelId: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  recipient: ComplaintRecipient;
  status: ComplaintStatus;
  attachments?: string[];
  assignedTo?: string;
  resolution?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
