// src/modules/profile/profile.routes.js
import { Router } from 'express';
import * as profileController from './profile.controller.js';
import { requireRole } from '../../middlewares/role.middleware.js';
import { ROLES } from '../../constants/roles.js';
import authMiddleware  from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validation.middleware.js';
import {
  updateProfileValidation,
  requestRoleValidation,
  switchRoleValidation,
  roleActionValidation
} from './profile.validate.js';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Profile endpoints
router.route('/me')
  .get(profileController.getMyProfile)
  .put(
    updateProfileValidation,
    validate,
    profileController.updateMyProfile
  );

// Role management
router.post(
  '/roles/request',
  requestRoleValidation,
  validate,
  profileController.requestProfessionalRole
);

router.post(
  '/roles/switch',
  switchRoleValidation,
  validate,
  profileController.switchRole
);

// Admin routes
router.get(
  '/admin/roles/pending',
  requireRole(ROLES.ADMIN),
  profileController.getPendingRequests
);

router.post(
  '/admin/roles/:profileId/approve',
  [requireRole(ROLES.ADMIN), ...roleActionValidation],
  validate,
  profileController.approveRoleRequest
);

router.post(
  '/admin/roles/:profileId/reject',
  [requireRole(ROLES.ADMIN), ...roleActionValidation],
  validate,
  profileController.rejectRoleRequest
);

export default router;