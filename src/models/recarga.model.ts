// src/models/recarga.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IRecarga extends Document {
  nombre: string;
  detalle: string;
  monto: number;
  fecha: Date;
}

const RecargaSchema = new Schema<IRecarga>({
  nombre: { type: String, required: true },
  detalle: { type: String, required: true },
  monto: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
});

export default mongoose.model<IRecarga>("Recarga", RecargaSchema);
