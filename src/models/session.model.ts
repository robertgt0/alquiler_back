import { Schema, model, Document, Types } from "mongoose";

export interface ISession extends Document {
  userId: Types.ObjectId;
  token: string;
  refreshToken?: string;
  deviceInfo: {
    userAgent: string;
    ip: string;
    browser?: string;
    os?: string;
    device?: string;
  };
  location?: {
    country?: string;
    city?: string;
  };
  isActive?: boolean;
  lastActivity?: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    token: { type: String, required: true },
    refreshToken: { type: String },

    deviceInfo: {
      userAgent: { type: String, required: true },
      ip: { type: String, required: true },
      browser: { type: String },
      os: { type: String },
      device: { type: String },
    },

    location: {
      country: { type: String },
      city: { type: String },
    },

    isActive: { type: Boolean, default: true },
    lastActivity: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

// TTL automático (Mongo elimina cuando expira)
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session = model<ISession>("Session", sessionSchema);
