import User from "../user/user.model.js";
import { hash as hashPassword } from "../../utils/password.js";

/**
 * Create a user with a specified role (admin-only operation)
 */
export const createUser = async ({ email, password, name, role }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error("Email already in use");
    err.status = 409;
    throw err;
  }
  const hashed = await hashPassword(password);
  const user = await User.create({ email, password: hashed, name, role });
  return user;
};

/**
 * Update user role (admin-only operation)
 */
export const updateUserRole = async (userId, newRole) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { role: newRole },
    { new: true }
  );
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }
  return user;
};

/**
 * List all users (admin-only operation)
 */
export const listUsers = async (limit = 50, skip = 0) => {
  const users = await User.find({}).select("-password").limit(limit).skip(skip);
  const total = await User.countDocuments({});
  return { users, total };
};

export default { createUser, updateUserRole, listUsers };
