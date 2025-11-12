import mongoose, { Schema, Document } from 'mongoose';

export interface IUbicacion extends Document {
  nombre: string;
  posicion: {
    lat: number;
    lng: number;
  };
  direccion: string;
  tipo: string;
}

const UbicacionSchema: Schema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  posicion: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  direccion: {
    type: String,
    required: true,
    trim: true
  },
  tipo: {
    type: String,
    required: true,
    default: 'punto-interes'
  }
}, {
  timestamps: true
});

export default mongoose.model<IUbicacion>('Ubicacion', UbicacionSchema);