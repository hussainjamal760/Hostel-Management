export type ComplaintStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ComplaintCategory =
  | 'MAINTENANCE'
  | 'FOOD'
  | 'SECURITY'
  | 'CLEANLINESS'
  | 'OTHER';

export interface IComplaint {
  _id: string;
  studentId: string;
  hostelId: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  attachments?: string[];
  assignedTo?: string;
  resolution?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
