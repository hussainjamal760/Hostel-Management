export type FeeStatus = 'PAID' | 'PARTIAL' | 'DUE' | 'OVERDUE';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type StudentStatus = 'ACTIVE' | 'LEFT' | 'EXPELLED';

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
  fullName: string;
  fatherName: string;
  dateOfBirth: Date;
  gender: Gender;
  bloodGroup?: string;
  emergencyContact: IEmergencyContact;
  permanentAddress: string;
  institution?: string;
  course?: string;
  // Extended Profile
  cnic: string;
  fatherPhone: string;
  fatherCnic: string;
  monthlyFee: number;
  securityDeposit: number;
  agreementDate: Date;
  joinDate: Date;
  expectedLeaveDate?: Date;
  feeStatus: FeeStatus;
  status: StudentStatus;
  totalDue: number;
  idProof?: string;
  photo?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
