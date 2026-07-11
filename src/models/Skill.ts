import mongoose, { Schema, models } from "mongoose";

const SkillSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    category: { type: String, enum: ["skill", "technology", "tool"], default: "skill" },
    level: { type: Number, default: 80, min: 0, max: 100 },
    proficiency: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Intermediate" },
    icon: { type: String, default: "" },
    order: { type: Number, default: 0 },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default models.Skill || mongoose.model("Skill", SkillSchema);