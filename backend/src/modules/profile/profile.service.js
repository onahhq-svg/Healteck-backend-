// src/modules/profile/profile.service.js
import Profile from './profile.model.js';
import { ROLES, ROLE_STATUS } from '../../constants/roles.js';
import { NotFoundError, BadRequestError } from '../../utils/error.js';

export const getProfileByUserId = async (userId) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) {
    throw new NotFoundError('Profile not found');
  }
  return profile;
};

export const getOrCreateProfile = async (userId) => {
  return await Profile.getOrCreate(userId);
};

export const updateBaseProfile = async (userId, updateData) => {
  const profile = await getOrCreateProfile(userId);
  
  if (updateData.baseProfile) {
    Object.assign(profile.baseProfile, updateData.baseProfile);
  }
  
  return await profile.save();
};

export const requestRole = async (userId, roleName) => {
  const profile = await getOrCreateProfile(userId);
  
  // Check if role already exists
  const existingRole = profile.roles.find(r => r.name === roleName);
  if (existingRole) {
    if (existingRole.status === ROLE_STATUS.PENDING) {
      throw new BadRequestError('Role request already pending');
    }
    if (existingRole.status === ROLE_STATUS.APPROVED) {
      throw new BadRequestError('Role already approved');
    }
  }

  // Add new role request
  profile.roles.push({
    name: roleName,
    status: ROLE_STATUS.PENDING
  });

  return await profile.save();
};

export const switchActiveRole = async (userId, roleName) => {
  const profile = await getOrCreateProfile(userId);
  
  // For USER role, no need to check approval
  if (roleName === ROLES.USER) {
    profile.activeRole = ROLES.USER;
    return await profile.save();
  }

  // For professional roles, check if approved
  const hasApprovedRole = profile.roles.some(
    r => r.name === roleName && r.status === ROLE_STATUS.APPROVED
  );
  
  if (!hasApprovedRole) {
    throw new BadRequestError('You do not have this approved role');
  }

  profile.activeRole = roleName;
  return await profile.save();
};

export const getPendingRoleRequests = async () => {
  return await Profile.find({
    'roles.status': ROLE_STATUS.PENDING
  }).populate('userId', 'name email');
};

export const updateRoleStatus = async (profileId, roleName, status, adminId) => {
  const profile = await Profile.findById(profileId);
  if (!profile) {
    throw new NotFoundError('Profile not found');
  }

  const roleIndex = profile.roles.findIndex(r => 
    r.name === roleName && r.status === ROLE_STATUS.PENDING
  );

  if (roleIndex === -1) {
    throw new NotFoundError('No pending request found for this role');
  }

  profile.roles[roleIndex].status = status;
  profile.roles[roleIndex].approvedAt = new Date();
  profile.roles[roleIndex].approvedBy = adminId;

  return await profile.save();
};