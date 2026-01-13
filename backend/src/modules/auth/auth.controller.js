import * as authService from "./auth.service.js";
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} from "./auth.validation.js";
import * as passwordResetService from "../../services/passwordReset.service.js";

export const register = async (req, res) => {
  const payload = validateRegister(req.body);
  const { user, tokens } = await authService.register(payload);
  res.status(201).json({
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    tokens,
  });
};

export const login = async (req, res) => {
  const payload = validateLogin(req.body);
  const { user, tokens } = await authService.login(payload);
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

export default {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
};
