import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true, lowercase: true },
    role: { type: String, enum: ["admin", "viewer"], default: "admin" },
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);