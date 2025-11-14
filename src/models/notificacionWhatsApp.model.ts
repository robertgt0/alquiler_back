import { Schema, model, Document } from "mongoose";

export interface INotificacionWhatsApp extends Document {
  __v: number;
  channel: string;
  createdAt: Date;
  destinations: {
    name: string;
    phone: string;
  }[];
  message: {
    content: string;
    createdAt: Date;
    type: string; // texto, imagen, etc.
  };
  meta: {
    createdAt: Date;
    provider: string; // Twilio, Meta API, etc.
  };
  sentAt: Date;
  status: "pending" | "sent" | "failed";
  transactionId: string;
}

const notificacionWhatsAppSchema = new Schema<INotificacionWhatsApp>(
  {
    __v: { type: Number, default: 0 },
    channel: { type: String, required: true, default: "whatsapp" },
    createdAt: { type: Date, default: Date.now },

    destinations: [
      {
        name: { type: String, required: true },
        phone: { type: String, required: true },
      },
    ],

    message: {
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
      type: { type: String, required: true },
    },

    meta: {
      createdAt: { type: Date, default: Date.now },
      provider: { type: String, required: true },
    },

    sentAt: { type: Date },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    transactionId: { type: String, required: true },
  },
  { timestamps: true }
);

export const NotificacionWhatsApp = model<INotificacionWhatsApp>(
  "Notificaciones-whatsApp",
  notificacionWhatsAppSchema,
  "notificaciones_whatsapp"
);
