import { Schema, model } from 'mongoose';

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
    id: { type: String, required: true, unique: true },
    ownerId: { type: String, default: 'fixer-1' },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, required: true },
    contact: { type: ContactSchema, default: {} },
    createdAt: { type: Date, default: () => new Date() },
    status: { type: String, enum: ['active', 'inactive', 'deleted'], default: 'active' },
    images: { type: [String], default: [] },
    descripcion: { type: String },
    categoria: { type: String },
    imagen: { type: String }
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    strict: false,
    collection: 'ofertas'
  }
);

export const OfferModel = model('Offer', OfferSchema);