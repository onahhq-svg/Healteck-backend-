import mongoose from "mongoose";
const { Schema } = mongoose;

const passwordResetTokenSchema = new Schema({
    token:{type:String, required:true, index:true},
    user:{type:Schema.Types.ObjectId, ref:"User", required:true},
    expiresAt:{type:Date, required:true},
    usedAt:{type:Date},
},{timestamps:true});

//auto-delete expired tokens (1hr)
passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export default mongoose.model("PasswordResetToken", passwordResetTokenSchema);