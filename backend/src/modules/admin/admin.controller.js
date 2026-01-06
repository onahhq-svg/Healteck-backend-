import * as adminService from "./admin.service.js";
import { validateCreateUser, validateUpdateRole } from "./admin.validation.js";

/**
 * Create a new user (admin-only)
 */
export const createUser = async (req, res) => {
  const payload = validateCreateUser(req.body);
  const user = await adminService.createUser(payload);
  res.status(201).json({
    success: true,
    message: "User created",
    data: { user },
    timestamp: new Date().toISOString(),
  });
};

/**
 * Update user role (admin-only)
 */
export const updateRole = async (req, res) => {
  const { userId } = req.params;
  const payload = validateUpdateRole(req.body);
  const user = await adminService.updateUserRole(userId, payload.role);
  res.json({
    success: true,
    message: "User role updated",
    data: { user },
    timestamp: new Date().toISOString(),
  });
};

/**
 * List all users (admin-only)
 */
export const listUsers = async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 50, 100);
  const skip = parseInt(req.query.skip) || 0;
  const result = await adminService.listUsers(limit, skip);
  res.json({
    success: true,
    message: "Users retrieved",
    data: result.users,
    meta: { total: result.total, limit, skip },
    timestamp: new Date().toISOString(),
  });
};

export default { createUser, updateRole, listUsers };
