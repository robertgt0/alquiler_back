// src/models/ofertaVista.model.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IOfertaVista extends Document {
  clienteId: Types.ObjectId;  // ID del requester
  servicioId: Types.ObjectId; // ID del servicio que ya vio
  vistoPor: 'notificacion' | 'manual'; // Cómo lo vio
  fechaVista: Date;
}

const OfertaVistaSchema = new Schema<IOfertaVista>(
  {
    clienteId: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true },
    servicioId: { type: Schema.Types.ObjectId, ref: 'Servicio', required: true },
    vistoPor: { type: String, enum: ['notificacion', 'manual'], default: 'notificacion' },
    fechaVista: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Índice compuesto para evitar duplicados
OfertaVistaSchema.index({ clienteId: 1, servicioId: 1 }, { unique: true });

export const OfertaVista = model<IOfertaVista>('OfertaVista', OfertaVistaSchema);