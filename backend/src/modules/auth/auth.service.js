import User from "../user/user.model.js";
import RefreshToken from "../../models/refreshToken.model.js";
import {
  hash as hashPassword,
  compare as comparePassword,
} from "../../utils/password.js";
import {
  signAccess,
  signRefresh,
  hashToken,
  verifyRefresh,
} from "../../utils/token.js";
import ms from "ms";
import jwt from "../../config/env.js";
import nodemailer from "nodemailer";
import OtpToken from "../../models/otpToken.model.js";
import emailConfig from "../../config/email.config.js";

const createTokensForUser = async (user) => {
  const payload = { sub: user._id.toString(), role: user.role };
  const accessToken = signAccess(payload);
  const refreshToken = signRefresh({ sub: user._id.toString() });

  const hashed = hashToken(refreshToken);
  const expiresAt = new Date(
    Date.now() + (ms(jwt.refreshTTL || "7d") || ms("7d")),
  );

  await RefreshToken.create({ token: hashed, user: user._id, expiresAt });

  return { accessToken, refreshToken };
};

const register = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error("Email already in use");
    err.status = 409;
    throw err;
  }
  const hashed = await hashPassword(password);
  const user = await User.create({ name, email, password: hashed });
  const tokens = await createTokensForUser(user);
  return { user, tokens };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const ok = await comparePassword(password, user.password);
  if (!ok) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const tokens = await createTokensForUser(user);
  return { user, tokens };
};

const refresh = async ({ refreshToken }) => {
  try {
    const payload = verifyRefresh(refreshToken);
    const hashed = hashToken(refreshToken);
    const stored = await RefreshToken.findOne({ token: hashed }).populate(
      "user",
    );
    if (!stored || stored.revokedAt) {
      const err = new Error("Invalid refresh token");
      err.status = 401;
      throw err;
    }
    if (stored.expiresAt < new Date()) {
      const err = new Error("Refresh token expired");
      err.status = 401;
      throw err;
    }

    // rotate: revoke old and create new
    stored.revokedAt = new Date();
    const newRefreshToken = signRefresh({ sub: payload.sub });
    const newHashed = hashToken(newRefreshToken);
    stored.replacedByToken = newHashed;
    await stored.save();

    const expiresAt = new Date(
      Date.now() + (ms(jwt.refreshTTL || "7d") || ms("7d")),
    );
    await RefreshToken.create({
      token: newHashed,
      user: stored.user._id,
      expiresAt,
    });

    const accessToken = signAccess({
      sub: payload.sub,
      role: stored.user.role,
    });
    return { accessToken, refreshToken: newRefreshToken };
  } catch (err) {
    err.status = err.status || 401;
    throw err;
  }
};

const logout = async ({ refreshToken }) => {
  const hashed = hashToken(refreshToken);
  const stored = await RefreshToken.findOne({ token: hashed });
  if (stored && !stored.revokedAt) {
    stored.revokedAt = new Date();
    await stored.save();
  }
  return;
};

//for otp
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTPEmail(email) {
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
  await OtpToken.create({ email, otp, expiresAt });

  console.log("📧 [SENDOTP] Email Config:", {
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.secure,
    user: emailConfig.auth.user || "NOT SET",
  });

  const transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.secure,
    auth: emailConfig.auth.user
      ? {
          user: emailConfig.auth.user,
          pass: emailConfig.auth.pass,
        }
      : undefined,
    tls: emailConfig.tls,
  });
  await transporter.sendMail({
    from: '"HealTek" <noreply@healtek.com>',
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
  });
}

export { register, login, refresh, logout, createTokensForUser, sendOTPEmail };
export default {
  register,
  login,
  refresh,
  logout,
  createTokensForUser,
  sendOTPEmail,
};
