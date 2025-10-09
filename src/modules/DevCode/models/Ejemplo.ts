import mongoose, { Schema, Document } from 'mongoose';
import { EjemploEntity } from '../types';

export interface EjemploDocument extends EjemploEntity, Document {}

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