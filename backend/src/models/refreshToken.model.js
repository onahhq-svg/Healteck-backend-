import mongoose from "mongoose";
const { Schema } = mongoose;

const refreshTokenSchema = new Schema({
  token: { type: String, required: true, index: true }, // hashed token
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    revokedAt: { type: Date },
    replacedByToken: { type: String },
});

export default mongoose.model("RefreshToken", refreshTokenSchema);
