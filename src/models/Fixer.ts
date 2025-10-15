import mongoose, { Schema, Document } from 'mongoose';

export interface IFixer extends Document {
  nombre: string;
  posicion: {
    lat: number;
    lng: number;
  };
  especialidad: string;
  descripcion?: string;
  rating?: number;
  whatsapp?: string;
  verified?: boolean;
}

const FixerSchema: Schema = new Schema({
  nombre: { type: String, required: true },
  posicion: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  especialidad: { type: String, required: true },
  descripcion: { type: String },
  rating: { type: Number, default: 4.5 },
  whatsapp: { type: String },
  verified: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model<IFixer>('Fixer', FixerSchema);