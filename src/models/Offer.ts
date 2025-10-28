// src/models/Offer.ts
import { Schema, model, models } from 'mongoose';

const ContactSchema = new Schema(
  {
    whatsapp: { type: String },
    phone: { type: String },
    email: { type: String },
  },
  { _id: false }
);

const OfferSchema = new Schema(
  {
    // id “legible” (HU10 permite buscar por id o por _id)
    id: { type: String, index: true },

    ownerId: { type: String, default: 'fixer-1' },

    // Campos “nuevos”
    title: { type: String },
    description: { type: String },
    category: { type: String },

    // Compatibilidad con documentos “históricos” en español
    descripcion: { type: String },
    categoria: { type: String },
    imagen: { type: String }, // cuando viene una sola imagen

    // Contacto
    contact: { type: ContactSchema, default: {} },

    images: { type: [String], default: [] },

    status: {
      type: String,
      enum: ['active', 'inactive', 'deleted'],
      default: 'active',
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    strict: false,                 // acepta campos extra de docs viejos
    collection: 'ofertas',         // ⬅️ MUY IMPORTANTE: usa la colección correcta
  }
);

export const OfferModel = models.Offer ?? model('Offer', OfferSchema);
