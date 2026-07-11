import mongoose, { Schema, models } from "mongoose";

const ExperienceSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, default: "" },
    description: { type: String, default: "" },
    current: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Experience || mongoose.model("Experience", ExperienceSchema);
