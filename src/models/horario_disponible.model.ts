import { Schema, model, Document, Types } from "mongoose";

export interface IHorarioDisponible extends Document {
  proveedorId: Types.ObjectId; // ref: Fixer
  fecha: string; // "YYYY-MM-DD"
  horaInicio: string;
  horaFin: string;
}

const horarioDisponibleSchema = new Schema<IHorarioDisponible>(
  {
    proveedorId: { type: Schema.Types.ObjectId, ref: "Fixer", required: true },
    fecha: { type: String, required: true },
    horaInicio: { type: String, required: true },
    horaFin: { type: String, required: true },
  },
  { timestamps: true }
);

export const HorarioDisponible = model<IHorarioDisponible>(
  "HorarioDisponible",
  horarioDisponibleSchema
);
