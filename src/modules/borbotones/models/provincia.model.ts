import { Schema, model, Document } from "mongoose";
export interface IProvincia extends Document { id_provincia: number; nombre: string; id_ciudad: number; }
const ProvinciaSchema = new Schema<IProvincia>(
  { id_provincia: { type: Number, unique: true, required: true, index: true },
    nombre: { type: String, required: true, index: true },
    id_ciudad: { type: Number, required: true, index: true } },
  { collection: "provincias", timestamps: false }
);
export default model<IProvincia>("Provincia", ProvinciaSchema);
