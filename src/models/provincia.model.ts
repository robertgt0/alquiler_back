import { Schema, model, Document } from "mongoose";

export interface IProvincia extends Document {
  id_provincia: number;
  nombre: string;
  id_ciudad: number; // referencia al id_ciudad de la colección ciudades
}

const provinciaSchema = new Schema<IProvincia>(
  {
    id_provincia: { type: Number, required: true, unique: true },
    nombre: { type: String, required: true },
    id_ciudad: { type: Number, required: true, ref: "Ciudad" },
  },
  { timestamps: true }
);

export const Provincia = model<IProvincia>("Provincia", provinciaSchema);
