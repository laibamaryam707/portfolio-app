import mongoose, { Schema, models } from "mongoose";

const CustomCardSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "✨" },
    category: { type: String, default: "custom" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.CustomCard || mongoose.model("CustomCard", CustomCardSchema);
