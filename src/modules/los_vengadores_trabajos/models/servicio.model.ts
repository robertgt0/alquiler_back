import mongoose, { Schema, model, Document } from "mongoose";

export interface IServicio extends Document {
  nombre_servicio: string;
  descripcion?: string;
  precio_por_hora?: number;
  createdAt: Date;
  updatedAt: Date;
}

const servicioSchema = new Schema<IServicio>(
  {
    nombre_servicio: { type: String, required: true },
    descripcion: { type: String },
    precio_por_hora: { type: Number },
  },
  { timestamps: true }
);

const Servicio = mongoose.model<IServicio>("Servicio", servicioSchema);


export default Servicio;