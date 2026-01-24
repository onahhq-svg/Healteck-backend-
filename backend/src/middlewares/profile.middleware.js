// src/middlewares/profile.middleware.js
import * as profileService from '../modules/profile/profile.service.js';
import { ROLES } from '../constants/roles.js';

export const attachProfile = async (req, res, next) => {
  try {
    if (req.user) {
      const profile = await profileService.getOrCreateProfile(req.user.id);
      req.profile = profile;
      
      // If user is an admin, they can switch to admin role
      if (req.user.role === ROLES.ADMIN && !req.profile.roles.some(r => r.name === ROLES.ADMIN)) {
        req.profile.roles.push({
          name: ROLES.ADMIN,
          status: 'APPROVED'
        });
        await req.profile.save();
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};