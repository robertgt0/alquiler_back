import mongoose, { Schema, Model } from 'mongoose';
//import { MagicLinkToken } from '../types/auth.types';

export interface MagicLinkToken {
  token: string;
  email: string;
  userId: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

const magicLinkSchema = new Schema<MagicLinkToken>({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // Elimina automáticamente después de expirar
  },
  used: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const MagicLink: Model<MagicLinkToken> = mongoose.model<MagicLinkToken>('MagicLink', magicLinkSchema);