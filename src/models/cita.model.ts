import { Schema, model, Document, Types } from "mongoose";

export interface ICita extends Document {
  proveedorId: Types.ObjectId; // ref: Fixer
  servicioId: Types.ObjectId;  // ref: Servicio
  clienteId: Types.ObjectId;   // ref: Cliente
  fecha: string; // "YYYY-MM-DD"
  horario: {
    inicio: string;
    fin: string;
  };
  ubicacion?: {
    lat: number;
    lng: number;
    direccion?: string;
    notas?: string;
  };
  estado: 'pendiente' | 'confirmada' | 'cancelada';
  createdAt: Date;
  updatedAt: Date;
}

const citaSchema = new Schema<ICita>(
  {
    proveedorId: { type: Schema.Types.ObjectId, ref: "Fixer", required: true },
    servicioId: { type: Schema.Types.ObjectId, ref: "Servicio", required: true },
    clienteId: { type: Schema.Types.ObjectId, ref: "Cliente", required: true },
    fecha: { type: String, required: true },
    horario: {
      inicio: { type: String, required: true },
      fin: { type: String, required: true },
    },
    ubicacion: {
      lat: Number,
      lng: Number,
      direccion: String,
      notas: String,
    },
    estado: {
      type: String,
      enum: ["pendiente", "confirmada", "cancelada"],
      default: "pendiente",
    },
  },
  { timestamps: true }
);

export const Cita = model<ICita>("Cita", citaSchema);
