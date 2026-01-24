import * as authService from "./auth.service.js";
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} from "./auth.validation.js";
import * as passwordResetService from "../../services/passwordReset.service.js";
import OtpToken from "../../models/otpToken.model.js";
import User from "../user/user.model.js";

export const register = async (req, res) => {
  console.log("📥 [REGISTER] Request body:", {
    name: req.body.name,
    email: req.body.email,
    password: "***",
  });
  const payload = validateRegister(req.body);
  console.log("✅ [REGISTER] Validation passed:", {
    name: payload.name,
    email: payload.email,
  });
  const { user, tokens } = await authService.register(payload);
  console.log("👤 [REGISTER] User created:", {
    id: user._id,
    email: user.email,
    name: user.name,
  });

  // Send OTP email after user registration
  console.log("📧 [REGISTER] Sending OTP email to:", user.email);
  try {
    await authService.sendOTPEmail(user.email);
    console.log("✅ [REGISTER] OTP email sent successfully");
  } catch (emailError) {
    console.error(
      "❌ [REGISTER] Failed to send OTP email:",
      emailError.message,
    );
    // Note: We don't throw here - user can still use resend OTP feature
  }

  console.log(
    "🔑 [REGISTER] NOT returning tokens to frontend - user must verify OTP first",
  );
  res.status(201).json({
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    success: true,
    message: "Registration successful. Please verify your OTP.",
  });
};

export const login = async (req, res) => {
  console.log("📥 [LOGIN] Request for email:", req.body.email);
  const payload = validateLogin(req.body);
  console.log("✅ [LOGIN] Validation passed");
  const { user, tokens } = await authService.login(payload);
  console.log("👤 [LOGIN] User authenticated:", {
    id: user._id,
    email: user.email,
  });
  console.log("🔑 [LOGIN] Tokens generated and sent");
  res.json({
    user: { id: user._id, email: user.email, name: user.name, role: user.role },
    tokens,
  });
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(400).json({ message: "refreshToken required" });
  const tokens = await authService.refresh({ refreshToken });
  res.json(tokens);
};

export const logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(400).json({ message: "refreshToken required" });
  await authService.logout({ refreshToken });
  res.status(204).send();
};

export const forgotPassword = async (req, res) => {
  const { email } = validateForgotPassword(req.body);
  await passwordResetService.initiatePasswordReset(email);
  res.json({
    message:
      "If an account exists with this email, you will receive a password reset link",
  });
};
export const resetPassword = async (req, res) => {
  const { token, newPassword } = validateResetPassword(req.body);
  const { user } = await passwordResetService.resetPassword(token, newPassword);

  // Optionally log the user in automatically
  const tokens = await authService.createTokensForUser(user);
  res.json({
    message: "Password reset successful",
    tokens,
  });
};

//verify otp
export const verifyOTP = async (req, res) => {
  console.log("📥 [VERIFY OTP] Request for email:", req.body.email);
  const { email, otp } = req.body;
  console.log("🔍 [VERIFY OTP] Looking up OTP record for:", email);
  const record = await OtpToken.findOne({ email, otp });
  if (!record) {
    console.log("❌ [VERIFY OTP] Invalid OTP for email:", email);
    return res.status(400).json({ message: "Invalid OTP" });
  }

  console.log("✅ [VERIFY OTP] OTP verified, deleting record");
  await OtpToken.deleteOne({ _id: record._id });

  // Generate tokens only after OTP is verified
  const user = await User.findOne({ email });
  const { accessToken, refreshToken } =
    await authService.createTokensForUser(user);
  console.log("🔑 [VERIFY OTP] Tokens generated after verification");

  res.json({
    success: true,
    message: "OTP verified successfully",
    accessToken,
    refreshToken,
    user: { id: user._id, email: user.email, name: user.name, role: user.role },
  });
};

export default {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  verifyOTP,
};
