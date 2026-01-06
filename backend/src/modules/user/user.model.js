import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        name: { type: String },
        email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        },
        password: { type: String, required: true },
        role: { type: String, default: "USER" },
    },
    { timestamps: true }
    );

export default mongoose.model("User", userSchema);
