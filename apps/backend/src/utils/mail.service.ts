import nodemailer from 'nodemailer';
import { env, logger } from '../config';

class MailService {
  private transporter: nodemailer.Transporter;
  private fromEmail: string;

  constructor() {
    this.fromEmail = env.FROM_EMAIL || env.SMTP_USER;

    logger.info('Initializing MailService with Google OAuth2 (Google Cloud Console)');
    logger.info(`OAuth2 Config - user: "${env.SMTP_USER}", clientId starts with: "${env.GOOGLE_CLIENT_ID.substring(0, 15)}...", refreshToken starts with: "${env.GOOGLE_REFRESH_TOKEN.substring(0, 10)}..."`);
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: env.SMTP_USER,
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        refreshToken: env.GOOGLE_REFRESH_TOKEN,
      },
    });

    // Verify connection on startup
    this.transporter.verify()
      .then(() => logger.info('Mail transporter verified successfully - ready to send emails'))
      .catch((err) => logger.error(`Mail transporter verification FAILED: ${err.message}`));
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
    logger.info(`Sending mail - from: "${this.fromEmail}", to: "${options.to}", subject: "${options.subject}"`);
    try {
      const info = await this.transporter.sendMail({
        from: this.fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
      return info;
    } catch (error) {
      logger.error(`Error sending email: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
      throw error;
    }
  }
}

export const mailService = new MailService();
