import axios from 'axios';
import { env, logger } from '../config';

class MailService {
  private apiKey: string;
  private fromEmail: string;

  constructor() {
    this.apiKey = env.RESEND_API_KEY;
    this.fromEmail = env.FROM_EMAIL;
  }

  async sendVerificationEmail(to: string, code: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #4f46e5; text-align: center;">Verify Your Email</h2>
        <p>Hello,</p>
        <p>Thank you for signing up. Please use the following verification code to complete your registration:</p>
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #111827;">${code}</span>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request this email, please ignore it.</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="font-size: 12px; color: #6b7280; text-align: center;">&copy; ${new Date().getFullYear()} Hostel Management System. All rights reserved.</p>
      </div>
    `;

    await this.send({
      to,
      subject: 'Email Verification Code',
      html,
    });

    logger.info(`Verification email sent to ${to}`);
  }

  async sendEmail(options: { to: string; subject: string; html: string; text?: string }) {
    await this.send(options);
    logger.info(`Email sent to ${options.to} with subject: ${options.subject}`);
  }

  private async send(options: { to: string; subject: string; html: string; text?: string }) {
    logger.info(`Resend debug - from: "${this.fromEmail}", apiKey starts with: "${this.apiKey.substring(0, 8)}..."`);
    try {
      const response = await axios.post(
        'https://api.resend.com/emails',
        {
          from: this.fromEmail,
          to: [options.to],
          subject: options.subject,
          html: options.html,
          text: options.text,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        logger.error(`Resend API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }
}

export const mailService = new MailService();
