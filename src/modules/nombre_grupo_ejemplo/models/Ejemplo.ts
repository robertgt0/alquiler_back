import mongoose, { Schema, Document } from 'mongoose';
import { EjemploEntity } from '../types';

export type EjemploDocument = Document & Omit<EjemploEntity, "_id">;


const ejemploSchema = new Schema<EjemploDocument>(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    estado: {
      type: String,
      enum: ['activo', 'inactivo'],
      default: 'activo',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<EjemploDocument>('Ejemplo', ejemploSchema);