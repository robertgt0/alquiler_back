import { Schema, model, Document, Types } from "mongoose";

export interface IMagicLink extends Document {
  token: string;
  email: string;
  userId: Types.ObjectId;
  expiresAt: Date;
  used?: boolean;
  createdAt?: Date;
}

const magicLinkSchema = new Schema<IMagicLink>(
  {
    token: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } } // solo createdAt
);

// TTL automático: elimina enlaces expirados
magicLinkSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const MagicLink = model<IMagicLink>("MagicLink", magicLinkSchema);