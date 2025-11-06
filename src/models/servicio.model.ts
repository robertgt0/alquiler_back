import { Schema, model, Types } from 'mongoose';

export interface IServicio {
  nombre: string;
  descripcion: string;
  duracion: number; // en minutos
  precio: number;
  rating: number;
  proveedorId: Types.ObjectId; // <-- usar ObjectId
}

const ServicioSchema = new Schema<IServicio>({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  duracion: { type: Number, required: true },
  precio: { type: Number, required: true },
  rating: { type: Number, required: true },
  proveedorId: { type: Schema.Types.ObjectId, ref: 'Proveedor', required: true }
});

export const Servicio = model<IServicio>('Servicio', ServicioSchema);
