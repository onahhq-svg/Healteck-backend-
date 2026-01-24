// services/email.service.js
import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';
import emailConfig from '../config/email.config.js';

const transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.secure,
  auth: emailConfig.auth.user ? {
    user: emailConfig.auth.user,
    pass: emailConfig.auth.pass,
  } : undefined,
  tls: emailConfig.tls,
});

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: emailConfig.from,
    to: email,
    subject: 'Reset your password',
    html: `
      <p>You requested a password reset. Click the link below to set a new password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Password reset email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};