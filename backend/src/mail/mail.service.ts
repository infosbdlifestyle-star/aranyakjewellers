import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || 'test@ethereal.email',
        pass: process.env.SMTP_PASS || 'test-pass',
      },
    });
  }

  async sendWelcomeEmail(to: string, name: string, tempPassword?: string) {
    const subject = 'Welcome to Aranyak Jewellers - Admin Panel Access';
    let text = `Hello ${name},\n\nAn admin account has been created for you at Aranyak Jewellers.\n`;
    if (tempPassword) {
      text += `Your temporary password is: ${tempPassword}\n\nPlease log in and change it immediately.`;
    }
    const html = `<p>Hello ${name},</p><p>An admin account has been created for you at Aranyak Jewellers.</p>${
      tempPassword
        ? `<p>Your temporary password is: <strong>${tempPassword}</strong></p><p>Please log in and change it immediately.</p>`
        : ''
    }`;

    return this.sendMail(to, subject, text, html);
  }

  async sendPasswordResetEmail(to: string, resetLink: string) {
    const subject = 'Aranyak Jewellers - Password Reset Request';
    const text = `You requested a password reset. Click the link to reset your password: ${resetLink}`;
    const html = `<p>You requested a password reset.</p><p><a href="${resetLink}">Click here to reset your password</a></p><p>If you did not request this, please ignore this email.</p>`;

    return this.sendMail(to, subject, text, html);
  }

  private async sendMail(to: string, subject: string, text: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from: `"Aranyak Jewellers" <${process.env.SMTP_USER || 'noreply@aranyak.com'}>`,
        to,
        subject,
        text,
        html,
      });
      this.logger.log(`Message sent: ${info.messageId}`);
      if (process.env.SMTP_HOST === 'smtp.ethereal.email') {
        this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
      return true;
    } catch (error) {
      this.logger.error(`Error sending email to ${to}:`, error);
      return false;
    }
  }
}
