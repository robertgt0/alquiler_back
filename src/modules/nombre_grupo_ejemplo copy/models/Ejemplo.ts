import mongoose, { Schema, Document } from 'mongoose';

export interface IBorboton extends Document {
  nombre: string;
  fechaCreacion: Date;
  calificacion: number;
}

const BorbotonSchema: Schema = new Schema({
  nombre: { type: String, required: true },
  fechaCreacion: { type: Date, default: Date.now },
  calificacion: { type: Number, default: 0 },
});

export default mongoose.model<IBorboton>('Borboton', BorbotonSchema);
