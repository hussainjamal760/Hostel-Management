import { OwnerRequest, IOwnerRequestDocument } from './owner-request.model';
import { User } from '../users/user.model';
import { ApiError } from '../../utils';
import { mailService } from '../../utils';

export interface CreateOwnerRequestInput {
  businessName: string;
  businessPhone: string;
  businessAddress: string;
  reason: string;
}

export interface ReviewRequestInput {
  status: 'APPROVED' | 'REJECTED';
  adminNotes?: string;
}

export class OwnerRequestService {
  async createRequest(userId: string, data: CreateOwnerRequestInput): Promise<IOwnerRequestDocument> {
    // Check if user already has a pending request
    const existingRequest = await OwnerRequest.findOne({
      userId,
      status: 'PENDING',
    });

    if (existingRequest) {
      throw ApiError.badRequest('You already have a pending request');
    }

    // Check if user is already an owner
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    if (user.role === 'OWNER') {
      throw ApiError.badRequest('You are already a hostel owner');
    }

    const request = new OwnerRequest({
      userId,
      ...data,
    });

    await request.save();
    return request;
  }

  async getUserRequests(userId: string): Promise<IOwnerRequestDocument[]> {
    return OwnerRequest.find({ userId }).sort({ createdAt: -1 });
  }

  async getMyLatestRequest(userId: string): Promise<IOwnerRequestDocument | null> {
    return OwnerRequest.findOne({ userId }).sort({ createdAt: -1 });
  }

  async getAllPendingRequests(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [requests, total] = await Promise.all([
      OwnerRequest.find({ status: 'PENDING' })
        .populate('userId', 'name email phone avatar createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      OwnerRequest.countDocuments({ status: 'PENDING' }),
    ]);

    return {
      requests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async getAllRequests(status?: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const query = status ? { status } : {};

    const [requests, total] = await Promise.all([
      OwnerRequest.find(query)
        .populate('userId', 'name email phone avatar createdAt')
        .populate('reviewedBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      OwnerRequest.countDocuments(query),
    ]);

    return {
      requests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async reviewRequest(
    requestId: string,
    adminId: string,
    data: ReviewRequestInput
  ): Promise<IOwnerRequestDocument> {
    const request = await OwnerRequest.findById(requestId).populate('userId', 'name email');

    if (!request) {
      throw ApiError.notFound('Request not found');
    }

    if (request.status !== 'PENDING') {
      throw ApiError.badRequest('Request has already been reviewed');
    }

    request.status = data.status;
    request.adminNotes = data.adminNotes;
    request.reviewedBy = new (require('mongoose').Types.ObjectId)(adminId);
    request.reviewedAt = new Date();

    await request.save();

    // If approved, update user role to OWNER
    if (data.status === 'APPROVED') {
      await User.findByIdAndUpdate(request.userId, { role: 'OWNER' });
      
      // Send approval email
      const user = request.userId as any;
      if (user?.email) {
        try {
          await mailService.sendEmail({
            to: user.email,
            subject: 'Your Hostel Owner Request Has Been Approved!',
            html: `
              <h2>Congratulations, ${user.name}!</h2>
              <p>Your request to become a hostel owner on Hostelite has been <strong>approved</strong>.</p>
              <p>You can now list your hostels on our platform.</p>
              <p>Log in to your account and start adding your properties!</p>
              <br/>
              <p>Best regards,<br/>The Hostelite Team</p>
            `,
          });
        } catch (e) {
          // Email failure shouldn't block the approval
          console.error('Failed to send approval email:', e);
        }
      }
    } else if (data.status === 'REJECTED') {
      // Send rejection email
      const user = request.userId as any;
      if (user?.email) {
        try {
          await mailService.sendEmail({
            to: user.email,
            subject: 'Update on Your Hostel Owner Request',
            html: `
              <h2>Hello ${user.name},</h2>
              <p>We have reviewed your request to become a hostel owner on Hostelite.</p>
              <p>Unfortunately, your request has been <strong>declined</strong> at this time.</p>
              ${data.adminNotes ? `<p><strong>Reason:</strong> ${data.adminNotes}</p>` : ''}
              <p>If you believe this was a mistake, please contact our support team.</p>
              <br/>
              <p>Best regards,<br/>The Hostelite Team</p>
            `,
          });
        } catch (e) {
          console.error('Failed to send rejection email:', e);
        }
      }
    }

    return request;
  }

  async getPendingCount(): Promise<number> {
    return OwnerRequest.countDocuments({ status: 'PENDING' });
  }
}

export default new OwnerRequestService();
