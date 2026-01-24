// src/modules/profile/profile.controller.js
import * as profileService from "./profile.service.js";
import { ROLES, ROLE_STATUS } from "../../constants/roles.js";
import { BadRequestError } from "../../utils/error.js";

export const getMyProfile = async (req, res) => {
  const profile = await profileService.getOrCreateProfile(req.user.id);
  res.json(profile);
};

export const updateMyProfile = async (req, res) => {
  const updatedProfile = await profileService.updateBaseProfile(
    req.user.id,
    req.body
  );
  res.json(updatedProfile);
};

export const requestProfessionalRole = async (req, res) => {
  const { role } = req.body;

  if (![ROLES.THERAPIST, ROLES.FITNESS, ROLES.NUTRITIONIST].includes(role)) {
    throw new BadRequestError("Invalid role requested");
  }

  const profile = await profileService.requestRole(req.user.id, role);
  res.json({
    message: "Role request submitted successfully",
    profile,
  });
};

export const switchRole = async (req, res) => {
  const { role } = req.body;

  if (
    ![ROLES.USER, ROLES.THERAPIST, ROLES.FITNESS, ROLES.NUTRITIONIST].includes(
      role
    )
  ) {
    throw new BadRequestError("Invalid role");
  }

  const profile = await profileService.switchActiveRole(req.user.id, role);
  res.json({
    message: `Active role switched to ${role}`,
    profile,
  });
};

// Admin controllers
export const getPendingRequests = async (req, res) => {
  const requests = await profileService.getPendingRoleRequests();
  res.json(requests);
};

export const approveRoleRequest = async (req, res) => {
  const { profileId } = req.params;
  const { role } = req.body;

  const profile = await profileService.updateRoleStatus(
    profileId,
    role,
    ROLE_STATUS.APPROVED,
    req.user.id
  );

  res.json({
    message: "Role request approved",
    profile,
  });
};

export const rejectRoleRequest = async (req, res) => {
  const { profileId } = req.params;
  const { role } = req.body;

  const profile = await profileService.updateRoleStatus(
    profileId,
    role,
    ROLE_STATUS.REJECTED,
    req.user.id
  );

  res.json({
    message: "Role request rejected",
    profile,
  });
};
