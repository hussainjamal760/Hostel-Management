import cron from 'node-cron';
import { Student } from '../students/student.model';
import { Payment } from './payment.model';
import { Hostel } from '../hostels/hostel.model';
import { logger } from '../../utils';
import { mailService } from '../../utils/mail.service';
import notificationService from '../notifications/notification.service';
import { PAYMENT_STATUS, PAYMENT_TYPES, PAYMENT_METHODS, NOTIFICATION_TYPES } from '@hostelite/shared-constants';

interface ChallanGenerationResult {
  created: number;
  skipped: number;
  errors: string[];
}

class PaymentCronService {
  constructor() {
    this.initCronJobs();
  }

  private initCronJobs() {
    // 1. Monthly Challan Generation - Runs at 00:05 on the 1st of every month
    cron.schedule('5 0 1 * *', async () => {
      logger.info('[CRON] Starting monthly challan generation...');
      try {
        await this.generateMonthlyChallans();
      } catch (error) {
        logger.error('[CRON] Monthly challan generation failed:', error);
      }
    });

    // 2. Overdue Status Update - Runs daily at 01:00
    cron.schedule('0 1 * * *', async () => {
      logger.info('[CRON] Checking for overdue challans...');
      try {
        await this.markOverdueChallans();
      } catch (error) {
        logger.error('[CRON] Overdue update failed:', error);
      }
    });

    // 3. Payment Reminder - Runs daily at 09:00 (5 days before due)
    cron.schedule('0 9 * * *', async () => {
      logger.info('[CRON] Sending payment reminders...');
      try {
        await this.sendPaymentReminders();
      } catch (error) {
        logger.error('[CRON] Payment reminders failed:', error);
      }
    });

    logger.info('[CRON] Payment cron jobs initialized');
  }

  /**
   * Generate monthly challans for all active students
   * Called on the 1st of each month or manually via API
   */
  async generateMonthlyChallans(targetMonth?: number, targetYear?: number): Promise<ChallanGenerationResult> {
    const today = new Date();
    const month = targetMonth || (today.getMonth() + 1);
    const year = targetYear || today.getFullYear();
    const billingCycleId = `${year}-${month.toString().padStart(2, '0')}`;

    // Due date: 15th of the current month at 23:59:59
    const dueDate = new Date(year, month - 1, 15, 23, 59, 59);

    const result: ChallanGenerationResult = { created: 0, skipped: 0, errors: [] };

    // LOCK CHECK: Do ANY rent invoices exist for this billing cycle?
    const existingCount = await Payment.countDocuments({
      billingCycleId,
      paymentType: PAYMENT_TYPES.RENT
    });

    if (existingCount > 0) {
      logger.warn(`[CHALLAN] Invoices for ${billingCycleId} already exist (${existingCount} found). Continuing for any missing students.`);
    }

    // Get active hostels
    const activeHostels = await Hostel.find({ isActive: true }).select('_id name');
    if (activeHostels.length === 0) {
      logger.warn(`[CHALLAN] No active hostels found. Checked ${await Hostel.countDocuments({})} total hostels.`);
      return result;
    }

    const activeHostelIds = activeHostels.map(h => h._id);

    // Get active students in active hostels
    const students = await Student.find({
      isActive: true,
      status: 'ACTIVE',
      hostelId: { $in: activeHostelIds }
    }).populate('userId', 'email name _id');

    for (const student of students) {
      try {
        // Check for existing challan (prevents duplicates)
        const existingChallan = await Payment.findOne({
          studentId: student._id,
          billingCycleId,
          paymentType: PAYMENT_TYPES.RENT
        });

        if (existingChallan) {
          result.skipped++;
          continue;
        }

        // Skip students with no monthly fee
        if (!student.monthlyFee || student.monthlyFee <= 0) {
          result.skipped++;
          continue;
        }

        // Create challan
        const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
        const challan = await Payment.create({
          studentId: student._id,
          hostelId: student.hostelId,
          amount: student.monthlyFee,
          paymentType: PAYMENT_TYPES.RENT,
          paymentMethod: PAYMENT_METHODS.CASH, // Default
          status: PAYMENT_STATUS.UNPAID,
          month,
          year,
          dueDate,
          billingCycleId,
          description: `Monthly Rent - ${monthName} ${year}`,
          receiptNumber: `CHL-${billingCycleId}-${student._id.toString().slice(-6).toUpperCase()}`
        });

        // Update student fee status
        await Student.findByIdAndUpdate(student._id, { feeStatus: 'DUE' });

        // Send notifications (non-blocking)
        this.sendChallanNotifications(student, challan).catch(err => {
          logger.error(`[CHALLAN] Notification failed for ${student._id}:`, err);
        });

        result.created++;
      } catch (error: any) {
        // Handle duplicate key error gracefully
        if (error.code === 11000) {
          result.skipped++;
        } else {
          result.errors.push(`Student ${student._id}: ${error.message}`);
          logger.error(`[CHALLAN] Error for student ${student._id}:`, error);
        }
      }
    }

    logger.info(`[CHALLAN] Generated: ${result.created}, Skipped: ${result.skipped}, Errors: ${result.errors.length}`);
    return result;
  }

  /**
   * Send email and in-app notification for new challan
   */
  private async sendChallanNotifications(student: any, challan: any): Promise<void> {
    try {
      // Explicitly fetch user to ensure we have the email (and not relying on populated field)
      const User = require('../users/user.model').default;
      const user = await User.findById(student.userId);

      if (!user) {
        logger.warn(`[CHALLAN] User not found for student ${student._id}`);
        return;
      }

      if (!user.email || !user.email.includes('@')) {
        logger.warn(`[CHALLAN] Invalid email '${user.email}' for student ${student._id}`);
        return;
      }

      // In-app notification
      await notificationService.createNotification({
        userId: user._id,
        title: 'New Monthly Challan Generated',
        body: `Your monthly rent challan of Rs. ${challan.amount} for ${challan.description} is now due. Please pay by ${challan.dueDate.toLocaleDateString()}.`,
        type: (NOTIFICATION_TYPES as any).CHALLAN_GENERATED,
        data: { challanId: challan._id.toString(), amount: challan.amount }
      });

      // Email notification
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(user.email)) {
        await mailService.sendEmail({
          to: user.email,
          subject: `Monthly Rent Challan - ${challan.description}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
              <h2 style="color: #4f46e5; text-align: center;">Monthly Rent Challan</h2>
              <p>Dear ${student.fullName},</p>
              <p>Your monthly rent challan has been generated:</p>
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Amount:</strong> Rs. ${challan.amount}</p>
                <p><strong>Description:</strong> ${challan.description}</p>
                <p><strong>Due Date:</strong> ${challan.dueDate.toLocaleDateString()}</p>
                <p><strong>Receipt No:</strong> ${challan.receiptNumber}</p>
              </div>
              <p style="color: #ef4444;"><strong>Please pay before the due date to avoid late fees.</strong></p>
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
              <p style="font-size: 12px; color: #6b7280; text-align: center;">© ${new Date().getFullYear()} Hostel Management System</p>
            </div>
          `
        });
        logger.info(`[CHALLAN] Notifications sent to ${user.email} for student ${student._id}`);
      } else {
        logger.warn(`[CHALLAN] Skipping email - invalid format: ${user.email}`);
      }
    } catch (error) {
      logger.error(`[CHALLAN] Failed to send notifications for ${student._id}:`, error);
      // Non-blocking - don't throw
    }
  }

  /**
   * Mark unpaid challans as overdue after due date
   * Runs daily at 01:00 AM
   */
  async markOverdueChallans(): Promise<{ updated: number }> {
    const now = new Date();

    const result = await Payment.updateMany(
      {
        status: PAYMENT_STATUS.UNPAID,
        dueDate: { $lt: now },
        paymentType: PAYMENT_TYPES.RENT
      },
      {
        $set: { status: PAYMENT_STATUS.OVERDUE }
      }
    );

    // Get all students with overdue challans and update their fee status
    const overdueChallans = await Payment.find({
      status: PAYMENT_STATUS.OVERDUE,
      paymentType: PAYMENT_TYPES.RENT
    }).select('studentId');

    const studentIds = [...new Set(overdueChallans.map(c => c.studentId.toString()))];

    if (studentIds.length > 0) {
      await Student.updateMany(
        { _id: { $in: studentIds } },
        { $set: { feeStatus: 'OVERDUE' } }
      );

      // Send overdue notifications
      for (const studentId of studentIds) {
        try {
          const student = await Student.findById(studentId).populate('userId', 'email name _id');
          if (student && (student.userId as any)?._id) {
            await notificationService.createNotification({
              userId: (student.userId as any)._id,
              title: 'Payment Overdue',
              body: 'Your monthly rent payment is now overdue. Please pay immediately to avoid penalties.',
              type: (NOTIFICATION_TYPES as any).CHALLAN_OVERDUE,
              data: { studentId }
            });
          }
        } catch (error) {
          logger.error(`[OVERDUE] Failed to send notification for ${studentId}:`, error);
        }
      }
    }

    logger.info(`[OVERDUE] Marked ${result.modifiedCount} challans as overdue`);
    return { updated: result.modifiedCount };
  }

  /**
   * Send reminders 5 days before due date
   */
  async sendPaymentReminders(): Promise<{ sent: number }> {
    const fiveDaysFromNow = new Date();
    fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5);

    const startOfDay = new Date(fiveDaysFromNow);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(fiveDaysFromNow);
    endOfDay.setHours(23, 59, 59, 999);

    const pendingChallans = await Payment.find({
      status: PAYMENT_STATUS.UNPAID,
      dueDate: { $gte: startOfDay, $lte: endOfDay },
      paymentType: PAYMENT_TYPES.RENT
    }).populate({
      path: 'studentId',
      populate: { path: 'userId', select: 'email name _id' }
    });

    let sentCount = 0;

    for (const challan of pendingChallans) {
      const student = challan.studentId as any;
      const user = student?.userId as any;

      if (user?._id) {
        try {
          await notificationService.createNotification({
            userId: user._id,
            title: 'Payment Reminder',
            body: `Reminder: Your challan of Rs. ${challan.amount} is due in 5 days. Please pay by ${(challan as any).dueDate?.toLocaleDateString()}.`,
            type: (NOTIFICATION_TYPES as any).CHALLAN_REMINDER,
            data: { challanId: challan._id.toString() }
          });
          sentCount++;
        } catch (error) {
          logger.error(`[REMINDER] Failed for challan ${challan._id}:`, error);
        }
      }
    }

    logger.info(`[REMINDER] Sent ${sentCount} payment reminders`);
    return { sent: sentCount };
  }

  /**
   * Keep existing generateMonthlyDues for backward compatibility
   * @deprecated Use generateMonthlyChallans instead
   */
  async generateMonthlyDues(targetMonth?: number, targetYear?: number) {
    return this.generateMonthlyChallans(targetMonth, targetYear);
  }
}

export const paymentScheduler = new PaymentCronService();
