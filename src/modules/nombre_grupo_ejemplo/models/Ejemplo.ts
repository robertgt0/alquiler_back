import mongoose, { Schema, Document, Types } from 'mongoose';
import { EjemploEntity } from '../types';

// Definimos el tipo del documento Mongoose
export interface EjemploDocument extends Document {
  nombre: string;
  descripcion?: string;
  estado: 'activo' | 'inactivo';
  createdAt: Date;
  updatedAt: Date;
}