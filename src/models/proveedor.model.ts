import { Schema, model, Document } from 'mongoose';

export interface IServicio {
  _id?: string;
  nombre: string;
  descripcion: string;
  duracion: number; // en minutos
  precio: number;
  rating?: number;
}

export interface IDisponibilidad {
  dias: number[]; // 0 = domingo, 6 = sábado
  horaInicio: string; // "08:00"
  horaFin: string;    // "18:00"
  duracionTurno: number; // minutos
}

export interface IProveedor extends Document {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  password: string; // se guarda hasheada
  servicios: IServicio[];
  disponibilidad: IDisponibilidad;
  ubicacion?: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ServicioSchema = new Schema<IServicio>({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  duracion: { type: Number, required: true },
  precio: { type: Number, required: true },
  rating: { type: Number, default: 0 },
});

const DisponibilidadSchema = new Schema<IDisponibilidad>({
  dias: { type: [Number], required: true },
  horaInicio: { type: String, required: true },
  horaFin: { type: String, required: true },
  duracionTurno: { type: Number, required: true },
});

const ProveedorSchema = new Schema<IProveedor>(
  {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefono: { type: String },
    password: { type: String, required: true },
    servicios: [ServicioSchema],
    disponibilidad: { type: DisponibilidadSchema, required: true },
    ubicacion: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { timestamps: true }
);

export const Proveedor = model<IProveedor>('Proveedor', ProveedorSchema);
