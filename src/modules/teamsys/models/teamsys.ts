import mongoose, { Schema, Document } from 'mongoose';
import { TeamsysEntity } from '../types';

export interface TeamsysDocument extends TeamsysEntity, Document {}

const teamsysSchema = new Schema<TeamsysDocument>(
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

export default mongoose.model<TeamsysDocument>('Ejemplo1', teamsysSchema);