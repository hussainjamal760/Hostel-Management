import cron from 'node-cron';
import { Student } from '../students/student.model';
import { Payment } from './payment.model';
import { logger } from '../../utils';

class PaymentCronService {
  constructor() {
    this.initCronJobs();
  }

  private initCronJobs() {
    // Run at 00:00 on the 1st day of every month
    cron.schedule('0 0 1 * *', async () => {
      logger.info('Running Monthly Due Generator Cron Job');
      await this.generateMonthlyDues();
    });
  }

  /**
   * Resets all active students' fee status to 'DUE' for the new month.
   */
  async generateMonthlyDues() {
    try {
      const today = new Date();
      
      // We should check if a payment already exists for THIS month + year.
      const currentMonth = today.getMonth() + 1;
      const currentYear = today.getFullYear();

      // Find all active students
      const students = await Student.find({ isActive: true });
      
      let updatedCount = 0;

      for (const student of students) {
         // Check if they already have a COMPLETED or PENDING payment for this month
         // (e.g. they paid early manually)
         const existingPayment = await Payment.findOne({
             studentId: student._id,
             month: currentMonth,
             year: currentYear,
             status: { $in: ['COMPLETED', 'PENDING'] } // If pending, they engaged flow already
         });

         if (!existingPayment) {
             // Reset to DUE
             student.feeStatus = 'DUE';
             // Ideally we should track arrears, but user request simplified: "new invoice generated"
             // which implies "feeStatus becomes DUE".
             
             // Optionally add to totalDue?
             // student.totalDue += student.monthlyFee; 
             // Logic: If previous month wasn't paid, they stay DUE. totalDue might need manual calc or simple increment.
             // For MVP: Just ensuring they are DUE opens the portal for them to pay.
             
             await student.save();
             updatedCount++;
         }
      }
      
      logger.info(`Generated monthly dues for ${updatedCount} students.`);
      return { message: `Generated monthly dues for ${updatedCount} students.` };

    } catch (error) {
      logger.error('Failed to generate monthly dues:', error);
      throw error;
    }
  }
}

export const paymentScheduler = new PaymentCronService();
