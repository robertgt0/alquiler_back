// src/modules/los_vengadores_trabajos/models/trabajo-solicitado.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ITrabajoSolicitado extends Document {
  proveedor?: string | null;   // vinculado con entidad Proveedor
  cliente?: string | null;     // vinculado con entidad Cliente
  fecha: string;               // Dia/Mes/Año
  hora_inicio: string;         // HH:mm
  hora_fin: string;            // HH:mm
  estado?: string;             // pendiente, confirmado, etc.
}

const TrabajoSolicitadoSchema = new Schema<ITrabajoSolicitado>(
  {
    proveedor: { type: String, required: false },
    cliente: { type: String, required: false },
    fecha: { type: String, required: true },
    hora_inicio: { type: String, required: true },
    hora_fin: { type: String, required: true },
    estado: { type: String, default: "pendiente" },
  },
  { timestamps: true }
);

export default mongoose.model<ITrabajoSolicitado>(
  "TrabajoSolicitado",
  TrabajoSolicitadoSchema
);