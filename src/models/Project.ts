import mongoose, { Schema, models } from "mongoose";

const ProjectSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    technologies: [{ type: String }],
    tags: [{ type: String }],
    category: { type: String, default: "Web App" },
    status: { type: String, enum: ["Completed", "In Progress"], default: "Completed" },
    featured: { type: Boolean, default: false },
    liveUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    order: { type: Number, default: 0 },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default models.Project || mongoose.model("Project", ProjectSchema);