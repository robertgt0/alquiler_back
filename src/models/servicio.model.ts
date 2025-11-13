import { Schema, model, Document, Types } from "mongoose";

export interface IServicio extends Document {
  id_servicio?: number;
  nombre: string;
  descripcion: string;
  duracion?: number;
  duracion_estimada?: number;
  precio?: number;
  precio_base?: number;
  rating?: number;
  proveedorId?: Types.ObjectId; // ref: Fixer
  fecha_creacion?: Date;
}

const servicioSchema = new Schema<IServicio>(
  {
    id_servicio: { type: Number },
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    duracion: { type: Number },
    duracion_estimada: { type: Number },
    precio: { type: Number },
    precio_base: { type: Number },
    rating: { type: Number, min: 0, max: 5 },
    proveedorId: { type: Schema.Types.ObjectId, ref: "Fixer" },
    fecha_creacion: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Servicio = model<IServicio>("Servicio", servicioSchema);
