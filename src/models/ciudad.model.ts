import { Schema, model, Document } from "mongoose";

export interface ICiudad extends Document {
  id_ciudad: number;
  nombre: string;
  zona: string;
  codigo_postal: string;
  fecha_creacion: string;
}

const ciudadSchema = new Schema<ICiudad>(
  {
    id_ciudad: { type: Number, required: true, unique: true },
    nombre: { type: String, required: true },
    zona: { type: String, required: true },
    codigo_postal: { type: String, required: true },
    fecha_creacion: { type: String, required: true },
  },
  { timestamps: true }
);

export const Ciudad = model<ICiudad>("Ciudad", ciudadSchema);
