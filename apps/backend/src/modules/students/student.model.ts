import mongoose, { Schema, Document } from 'mongoose';
import { IStudent } from '@hostelite/shared-types';
import { GENDERS, FEE_STATUS } from '@hostelite/shared-constants';

export interface IStudentDocument extends Omit<IStudent, '_id'>, Document {}

const emergencyContactSchema = new Schema(
  {
    name: { type: String, required: true },
    relation: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { _id: false }
);

const studentSchema = new Schema<IStudentDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId as any,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
      index: true,
    },
    hostelId: {
      type: Schema.Types.ObjectId as any,
      ref: 'Hostel',
      required: [true, 'Hostel is required'],
      index: true,
    },
    roomId: {
      type: Schema.Types.ObjectId as any,
      ref: 'Room',
      required: function(this: IStudentDocument): boolean { return this.status === 'ACTIVE'; },
      index: true,
    },
    bedNumber: {
      type: String,
      required: function(this: IStudentDocument): boolean { return this.status === 'ACTIVE'; },
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    cnic: {
      type: String,
      required: [true, 'CNIC is required'],
      trim: true,
      unique: true, 
    },
    fatherName: {
      type: String,
      required: [true, "Father's name is required"],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    fatherPhone: {
      type: String,
      required: [true, "Father's phone is required"],
      trim: true,
    },
    fatherCnic: {
      type: String,
      required: [true, "Father's CNIC is required"],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    gender: {
      type: String,
      enum: Object.values(GENDERS),
      required: [true, 'Gender is required'],
    },
    bloodGroup: {
      type: String,
      trim: true,
    },
    emergencyContact: {
      type: emergencyContactSchema,
      required: [true, 'Emergency contact is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required'],
      maxlength: [500, 'Address cannot exceed 500 characters'],
    },
    institution: {
      type: String,
      trim: true,
      maxlength: [200, 'Institution name cannot exceed 200 characters'],
    },
    course: {
      type: String,
      trim: true,
      maxlength: [100, 'Course name cannot exceed 100 characters'],
    },
    joinDate: {
      type: Date,
      required: [true, 'Join date is required'],
      default: Date.now,
    },
    expectedLeaveDate: {
      type: Date,
    },
    feeStatus: {
      type: String,
      enum: Object.values(FEE_STATUS),
      default: FEE_STATUS.DUE,
      index: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'LEFT', 'EXPELLED'],
      default: 'ACTIVE',
      index: true,
    },
    monthlyFee: {
      type: Number,
      required: [true, 'Monthly fee is required'],
      min: 0,
    },
    securityDeposit: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalDue: {
      type: Number,
      default: 0,
      min: 0,
    },
    agreementDate: {
      type: Date,
      required: [true, 'Agreement date is required'],
    },
    idProof: {
      type: String,
    },
    photo: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

studentSchema.index({ hostelId: 1, isActive: 1 });
studentSchema.index({ hostelId: 1, feeStatus: 1 });
// Fix: Only enforce unique room/bed for ACTIVE students. 
// "Left" students will have null/undefined room/bed, which would otherwise collide.
studentSchema.index({ roomId: 1, bedNumber: 1 }, { 
  unique: true, 
  partialFilterExpression: { status: 'ACTIVE' } 
});

studentSchema.virtual('age').get(function (this: IStudentDocument) {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

export const Student = mongoose.model<IStudentDocument>('Student', studentSchema);

export default Student;
