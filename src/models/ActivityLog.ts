import mongoose, { Schema, models } from "mongoose";

const ActivityLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true }, // created | updated | deleted | restored | purged
    entityType: { type: String, required: true }, // skill | project | profile
    entityName: { type: String, default: "" },
  },
  { timestamps: true }
);

export default models.ActivityLog || mongoose.model("ActivityLog", ActivityLogSchema);