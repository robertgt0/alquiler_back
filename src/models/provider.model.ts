import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { IUserDocument } from './user.model';

export interface IProvider {
  user: Types.ObjectId; // referencia al User
  servicios: string[];
  ubicacion: {
    lat: number;
    lng: number;
    direccion?: string;
  };
  horarios: string[]; // ejemplo: ['08:00-12:00', '14:00-18:00']
  calendario: {
    [fecha: string]: string[]; // fecha => lista de horas ocupadas
  };
  rating: number;
  trabajosCompletados: number;
}

export interface IProviderDocument extends IProvider, Document {}

const providerSchema = new Schema<IProviderDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    servicios: { type: [String], default: [] },
    ubicacion: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      direccion: { type: String },
    },
    horarios: { type: [String], default: [] },
    calendario: { type: Map, of: [String], default: {} },
    rating: { type: Number, default: 0 },
    trabajosCompletados: { type: Number, default: 0 },
  },
  {
    timestamps: true, // createdAt y updatedAt
    toJSON: {
      transform(_, ret: any) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Provider: Model<IProviderDocument> = mongoose.model<IProviderDocument>(
  'Provider',
  providerSchema
);

export default Provider;
