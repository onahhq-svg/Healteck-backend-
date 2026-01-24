// services/passwordReset.service.js
import PasswordResetToken from '../models/passwordResetToken.model.js';
import User from '../modules/user/user.model.js';
import { signToken, hashToken } from '../utils/token.js';
import { sendPasswordResetEmail } from './email.service.js';
import { hash as hashPassword } from '../utils/password.js';
import ms from 'ms';

const RESET_TOKEN_TTL = '1h';

export const initiatePasswordReset = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if user exists for security
    return;
  }

  // Generate token
  const token = signToken({ sub: user._id.toString() }, { expiresIn: RESET_TOKEN_TTL });
  const hashedToken = hashToken(token);
  const expiresAt = new Date(Date.now() + ms(RESET_TOKEN_TTL));

  // Save token
  await PasswordResetToken.create({
    token: hashedToken,
    user: user._id,
    expiresAt
  });

  // Send email
  await sendPasswordResetEmail(user.email, token);
};

export const resetPassword = async (token, newPassword) => {
  // Find token
  const hashedToken = hashToken(token);
  const resetToken = await PasswordResetToken.findOne({
    token: hashedToken,
    usedAt: { $exists: false },
    expiresAt: { $gt: new Date() }
  }).populate('user');

  if (!resetToken) {
    throw new Error('Invalid or expired reset token');
  }

  // Update user password
  const hashedPassword = await hashPassword(newPassword);
  await User.findByIdAndUpdate(resetToken.user._id, { 
    password: hashedPassword 
  });

  // Mark token as used
  resetToken.usedAt = new Date();
  await resetToken.save();

  // Invalidate all user sessions (optional)
  // await invalidateUserSessions(resetToken.user._id);

  return { user: resetToken.user };
};