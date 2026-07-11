import mongoose, { Schema, models } from "mongoose";

const CategorySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    color: { type: String, default: "#0ea5e9" },
  },
  { timestamps: true }
);

export default models.Category || mongoose.model("Category", CategorySchema);