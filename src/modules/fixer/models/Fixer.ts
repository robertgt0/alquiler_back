import { Schema, model, Types } from "mongoose";

const LocationSchema = new Schema({
  lat: { type: Number, required: true, min: -90, max: 90 },
  lng: { type: Number, required: true, min: -180, max: 180 },
  address: { type: String, trim: true, maxlength: 255 }
}, { _id: false });

// ⬇️ NUEVO: Schema para trabajos del fixer con descripción personalizada
const FixerJobSchema = new Schema({
  jobId: { type: String, required: true },
  jobName: { type: String, required: true },
  customDescription: { type: String, trim: true, maxlength: 500 }, // ← Descripción personalizada
  generalDescription: { type: String, trim: true }
}, { _id: false });

const FixerSchema = new Schema({
  userId: { type: Types.ObjectId, ref: "User", required: true },
  location: { type: LocationSchema, required: true },
  categories: [{ type: String }], // Mantener para compatibilidad
  fixerJobs: [FixerJobSchema]     // ⬇️ NUEVO: Array de trabajos con custom_description
}, { timestamps: true });

export default model("Fixer", FixerSchema);