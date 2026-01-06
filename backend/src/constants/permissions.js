export const PERMISSIONS = {
  USER_READ: "user:read",
  USER_WRITE: "user:write",
  ADMIN_ALL: "admin:all",
};

export const hasPermission = (userRole, permission) => {
  // Simple role -> permission mapping; extend as needed
  const rolePerms = {
    USER: [PERMISSIONS.USER_READ, PERMISSIONS.USER_WRITE],
    ADMIN: [
      PERMISSIONS.USER_READ,
      PERMISSIONS.USER_WRITE,
      PERMISSIONS.ADMIN_ALL,
    ],
  };
  const perms = rolePerms[userRole] || [];
  return perms.includes(permission);
};

export default { PERMISSIONS, hasPermission };
