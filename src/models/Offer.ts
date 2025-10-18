import { model, Schema, Document } from 'mongoose';

export type OfferStatus = 'active' | 'inactive' | 'deleted';

export interface Contact {
  whatsapp?: string;
  phone?: string;
  email?: string;
}

export interface OfferDoc extends Document {
  id: string;               // id legible para el front (p.ej. "1")
  ownerId?: string;
  title: string;
  description: string;
  category: string;
  contact: Contact;
  createdAt: Date;
  status: OfferStatus;
  images: string[];
}

const ContactSchema = new Schema<Contact>({
  whatsapp: { type: String },
  phone: { type: String },
  email: { type: String },
}, { _id: false });

const OfferSchema = new Schema<OfferDoc>(
  {
    id: { type: String, required: true, unique: true }, // importante para /offers/:id
    ownerId: { type: String },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, required: true },
    contact: { type: ContactSchema, default: {} },
    createdAt: { type: Date, default: () => new Date() },
    status: { type: String, enum: ['active', 'inactive', 'deleted'], default: 'active' },
    images: { type: [String], default: [] },
  },
  { collection: 'ofertas' }
);

export const OfferModel = model<OfferDoc>('Offer', OfferSchema);
