import mongoose from "mongoose";
import { Schema } from "mongoose";
import { ROLES, ROLE_STATUS } from "../../constants/roles.js";

const roleRequestSchema = new Schema({
  name: {
    type: String,
    required: true,
    enum: [ROLES.THERAPIST, ROLES.FITNESS, ROLES.NUTRITIONIST],
  },
  status: {
    type: String,
    enum: Object.values(ROLE_STATUS),
    default: ROLE_STATUS.PENDING,
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
  approvedAt: {
    type: Date,
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const profileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    baseProfile: {
      name: String,
      username: {
        type: String,
        unique: true,
        sparse: true,
      },
      profilePhoto: String,
      location: String,
      bio: String,
    },
    roles: [roleRequestSchema],
    activeRole: {
      type: String,
      enum: [ROLES.USER, ROLES.THERAPIST, ROLES.FITNESS, ROLES.NUTRITIONIST],
      default: ROLES.USER,
    },

    professionalInfo: {
      summary: String,
    },
  },
  { timestamps: true }
);

//INDEXES
// INDEXES
profileSchema.index(
  { "baseProfile.username": 1 },
  { unique: true, sparse: true }
);
profileSchema.index({ userId: 1 }, { unique: true });

//Static method to get or create profile
profileSchema.statics.getOrCreate = async function (userId) {
  let profile = await this.findOne({ userId });
  if (!profile) {
    profile = await this.create({
      userId,
      activeRole: ROLES.USER,
      roles: [],
    });
  }
  return profile;
};

export default mongoose.model("Profile", profileSchema);
