import mongoose, { Schema, model } from 'mongoose';
import { IFixer } from '../types/index';

const FixerSchema = new Schema<IFixer>({
  nombre: { type: String, required: true },
  usuario: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  hash_password: { type: String, required: true },
  activo: { type: Boolean, default: true },
  fecha_registro: { type: Date, default: Date.now },
  telefono: { type: String, required: false },
}, {
  collection: 'Fixer'
});

const FixerModel = mongoose.models.Fixer || model<IFixer>('Fixer', FixerSchema, 'Fixer');

export default FixerModel;
