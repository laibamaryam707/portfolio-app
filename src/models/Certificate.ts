import mongoose, { Schema, models } from "mongoose";

const CertificateSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    issuer: { type: String, default: "" },
    date: { type: String, default: "" },
    url: { type: String, default: "" },
    image: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Certificate || mongoose.model("Certificate", CertificateSchema);
