import { Schema, model, Document } from "mongoose";

export interface IEspecialidad extends Document {
  id_especialidad: number;
  nombre: string;
  fecha_creacion: string;
}

const especialidadSchema = new Schema<IEspecialidad>(
  {
    id_especialidad: { type: Number, required: true, unique: true },
    nombre: { type: String, required: true },
    fecha_creacion: { type: String, required: true },
  },
  { timestamps: true }
);

export const Especialidad = model<IEspecialidad>("Especialidad", especialidadSchema);
