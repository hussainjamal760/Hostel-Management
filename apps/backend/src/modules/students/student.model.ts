import mongoose, { Schema, Document } from 'mongoose';
import { IStudent } from '@hostelite/shared-types';
import { GENDERS, FEE_STATUS } from '@hostelite/shared-constants';

/**
 * Student Document Interface
 */
export interface IStudentDocument extends Omit<IStudent, '_id'>, Document {}

/**
 * Emergency Contact Sub-Schema
 */
const emergencyContactSchema = new Schema(
  {
    name: { type: String, required: true },
    relation: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { _id: false }
);

/**
 * Student Schema
 */
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
      required: [true, 'Room is required'],
      index: true,
    },
    bedNumber: {
      type: String,
      required: [true, 'Bed number is required'],
      trim: true,
    },
    // Personal Info
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    fatherName: {
      type: String,
      required: [true, "Father's name is required"],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
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
    // Contact
    emergencyContact: {
      type: emergencyContactSchema,
      required: [true, 'Emergency contact is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required'],
      maxlength: [500, 'Address cannot exceed 500 characters'],
    },
    // Academic
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
    // Hostel Status
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
    totalDue: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Gamification
    points: {
      type: Number,
      default: 0,
    },
    badges: {
      type: [String],
      default: [],
    },
    // Documents
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

// Indexes
studentSchema.index({ hostelId: 1, isActive: 1 });
studentSchema.index({ hostelId: 1, feeStatus: 1 });
studentSchema.index({ roomId: 1, bedNumber: 1 }, { unique: true });

/**
 * Virtual for age
 */
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

/**
 * Student Model
 */
export const Student = mongoose.model<IStudentDocument>('Student', studentSchema);

export default Student;
