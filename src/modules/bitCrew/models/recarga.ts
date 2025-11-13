// src/modules/bitCrew/models/recarga.ts
import mongoose, { Schema, Document } from "mongoose";

// Interfaz TypeScript para Recarga
export interface IRecarga extends Document {
  nombre: string;
  detalle: string;
  monto: number;
  correo: string;
  telefono: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fecha?: Date;
}

// Esquema Recarga
const RecargaSchema = new Schema<IRecarga>({
  nombre: { type: String, required: true },
  detalle: { type: String, required: true },
  monto: { type: Number, required: true },
  correo: { type: String, required: true },
  telefono: { type: String, required: true },
  tipoDocumento: { type: String, required: true },
  numeroDocumento: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
}, {
  collection: "recarga", // nombre de la colección en MongoDB
});

const RecargaModel = mongoose.models.Recarga || mongoose.model<IRecarga>("Recarga", RecargaSchema);

export default RecargaModel;
