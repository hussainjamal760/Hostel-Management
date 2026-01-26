import { Student } from '../students/student.model';
import { Payment } from './payment.model';
import { Hostel } from '../hostels/hostel.model';
import { logger } from '../../utils';
import { PAYMENT_STATUS, PAYMENT_TYPES, PAYMENT_METHODS } from '@hostelite/shared-constants';

class PaymentCronService {
  constructor() {
    this.initCronJobs();
  }

  private initCronJobs() {
    // CRON DISABLED: Manual trigger only as per user request.
    // cron.schedule('0 0 1 * *', async () => { ... });
  }

  /**
   * Generates Invoice (UNPAID Payment) for all active students for the new month.
   * Throws if invoices already exist for the target month (Manual Lock).
   */
  async generateMonthlyDues(targetMonth?: number, targetYear?: number) {
    try {
      const today = new Date();
      const currentMonth = targetMonth || (today.getMonth() + 1);
      const currentYear = targetYear || today.getFullYear();

      // LOCK CHECK: Do ANY rent invoices exist for this month/year?
      const existingCount = await Payment.countDocuments({
          month: currentMonth,
          year: currentYear,
          paymentType: PAYMENT_TYPES.RENT
      });

      if (existingCount > 0) {
          logger.warn(`Manual Trigger Blocked: Invoices for ${currentMonth}/${currentYear} already exist.`);
          throw new Error(`Invoices for ${currentMonth}/${currentYear} have already been generated.`);
      }
      const activeHostels = await Hostel.find({ isActive: true }).select('_id');
      const activeHostelIds = activeHostels.map(h => h._id);

      if (activeHostelIds.length === 0) {
          logger.warn('No active hostels found. Skipping invoice generation.');
          return { message: 'No active hostels found.' };
      }

      // Find all active students in active hostels
      const students = await Student.find({ 
          isActive: true,
          hostelId: { $in: activeHostelIds }
      });
      
      let createdCount = 0;

      for (const student of students) {
         // Double-safety check per student (though global check should catch it)
         const existingInvoice = await Payment.exists({
             studentId: student._id,
             month: currentMonth,
             year: currentYear,
             paymentType: PAYMENT_TYPES.RENT
         });

         if (existingInvoice) continue;

         // Create new UNPAID invoice
         await Payment.create({
             studentId: student._id,
             hostelId: student.hostelId,
             amount: student.monthlyFee,
             month: currentMonth,
             year: currentYear,
             status: PAYMENT_STATUS.UNPAID,
             paymentType: PAYMENT_TYPES.RENT,
             paymentMethod: PAYMENT_METHODS.CASH, 
             // Formatted receipt number: INV-YYYYMM-ADMISSION
             receiptNumber: `INV-${currentYear}${currentMonth.toString().padStart(2, '0')}-${student._id.toString().slice(-4).toUpperCase()}` 
         });
         
         // Update student status visualization
         student.feeStatus = 'DUE'; 
         await student.save();

         createdCount++;
      }
      
      logger.info(`Generated monthly invoices for ${createdCount} students.`);
      return { message: `Successfully generated ${createdCount} invoices for ${currentMonth}/${currentYear}.` };

    } catch (error) {
      logger.error('Failed to generate monthly dues:', error);
      throw error;
    }
  }
}

export const paymentScheduler = new PaymentCronService();
