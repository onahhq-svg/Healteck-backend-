// src/validations/profile.validation.js
import { body, param } from 'express-validator';
import { ROLES } from '../../constants/roles.js';

// Common validation rules
export const updateProfileValidation = [
  body('baseProfile.name').optional().isString().trim(),
  body('baseProfile.username').optional().isString().trim(),
  body('baseProfile.location').optional().isString().trim(),
  body('baseProfile.bio').optional().isString().trim(),
];

export const requestRoleValidation = [
  body('role')
    .isIn([ROLES.THERAPIST, ROLES.FITNESS, ROLES.NUTRITIONIST])
    .withMessage('Invalid role'),
];

export const switchRoleValidation = [
  body('role')
    .isIn([ROLES.USER, ROLES.THERAPIST, ROLES.FITNESS, ROLES.NUTRITIONIST])
    .withMessage('Invalid role'),
];

export const roleActionValidation = [
  param('profileId').isMongoId().withMessage('Invalid profile ID'),
  body('role')
    .isIn([ROLES.THERAPIST, ROLES.FITNESS, ROLES.NUTRITIONIST])
    .withMessage('Invalid role'),
];