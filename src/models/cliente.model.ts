import { Schema, model, Document, Types } from "mongoose";

export interface ICliente extends Document {
  _id: Types.ObjectId;
  nombre: string;
  correo: string;
  telefono: string;
  contraseña: string;
  carnet_identidad?: string;
  metodo_pago?: string;
  createdAt: Date;
  ubicacion?: {
    lat: number;
    lng: number;
    direccion?: string;
  };
}

const clienteSchema = new Schema<ICliente>(
  {
    nombre: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    telefono: { type: String, required: true },
    contraseña: { type: String, required: true },
    carnet_identidad: { type: String },
    metodo_pago: { type: String },
    ubicacion: {
      lat: { type: Number },
      lng: { type: Number },
      direccion: { type: String },
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } } // solo createdAt
);

export const Cliente = model<ICliente>("Cliente", clienteSchema);
