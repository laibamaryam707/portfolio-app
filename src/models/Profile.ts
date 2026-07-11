import mongoose, { Schema, models } from "mongoose";

const ProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    fullName: { type: String, default: "" },
    title: { type: String, default: "" },
    tagline: { type: String, default: "" },
    about: { type: String, default: "" },
    avatar: { type: String, default: "" },
    heroImage: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    twitter: { type: String, default: "" },
    website: { type: String, default: "" },
    layout: { type: String, default: "modern", enum: ["modern", "minimal", "creative", "professional", "developer"] },
    availableForWork: { type: Boolean, default: true },
    stats: {
      type: [{ label: String, value: String }],
      default: [
        { label: "Years Experience", value: "0" },
        { label: "Projects Built", value: "0" },
        { label: "Happy Clients", value: "0" },
        { label: "Certificates", value: "0" },
      ],
    },
  },
  { timestamps: true }
);

export default models.Profile || mongoose.model("Profile", ProfileSchema);
