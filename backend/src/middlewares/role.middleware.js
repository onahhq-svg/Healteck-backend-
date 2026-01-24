// src/middlewares/role.middleware.js
import { ROLES } from '../constants/roles.js';
import { ForbiddenError } from '../utils/error.js';

export const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ForbiddenError('Authentication required'));
        }

        // Admins have access to everything
        if (req.user.role === ROLES.ADMIN) {
            return next();
        }

        // Check if user's active role is in the allowed roles
        if (req.profile && allowedRoles.includes(req.profile.activeRole)) {
            return next();
        }

        // Check if user has any of the allowed roles (even if not active)
        const hasRole = req.profile?.roles.some(role => 
            role.status === 'APPROVED' && allowedRoles.includes(role.name)
        );

        if (hasRole) {
            return next();
        }

        next(new ForbiddenError('Insufficient permissions'));
    };
};

export default requireRole;