/**
 * Student Types
 * Student entity and related types
 */

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type FeeStatus = 'PAID' | 'PARTIAL' | 'DUE' | 'OVERDUE';

export interface IEmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface IStudent {
  _id: string;
  userId: string;
  hostelId: string;
  roomId: string;
  bedNumber: string;

  // Personal Info
  fullName: string;
  fatherName: string;
  dateOfBirth: Date;
  gender: Gender;
  bloodGroup?: string;

  // Contact
  emergencyContact: IEmergencyContact;
  permanentAddress: string;

  // Academic
  institution?: string;
  course?: string;

  // Hostel Status
  joinDate: Date;
  expectedLeaveDate?: Date;
  feeStatus: FeeStatus;
  totalDue: number;

  // Gamification
  points: number;
  badges: string[];

  // Documents
  idProof?: string;
  photo?: string;

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStudentCreate {
  roomId: string;
  bedNumber: string;
  fullName: string;
  fatherName: string;
  dateOfBirth: Date;
  gender: Gender;
  bloodGroup?: string;
  emergencyContact: IEmergencyContact;
  permanentAddress: string;
  institution?: string;
  course?: string;
  joinDate?: Date;
  expectedLeaveDate?: Date;
}

export interface IStudentUpdate {
  roomId?: string;
  bedNumber?: string;
  fullName?: string;
  fatherName?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  bloodGroup?: string;
  emergencyContact?: Partial<IEmergencyContact>;
  permanentAddress?: string;
  institution?: string;
  course?: string;
  expectedLeaveDate?: Date;
  idProof?: string;
  photo?: string;
}
