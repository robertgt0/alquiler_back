import { Schema, model, Document } from "mongoose";

export interface INotificacionGmail extends Document {
  __v: number;
  attempts: number;
  channel: string;
  createdAt: Date;
  destinations: {
    email: string;
    name: string;
  }[];
  message: {
    content: string;
    subject: string;
  };
  meta: {
    createdAt: Date;
  };
  providerResponse: {
    labelIds: string[];
    messageId: string;
    success: boolean;
    threadId: string;
  };
  sentAt: Date;
  status: "pending" | "sent" | "failed";
  transactionId: string;
}

const notificacionGmailSchema = new Schema<INotificacionGmail>(
  {
    __v: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    channel: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },

    destinations: [
      {
        email: { type: String, required: true },
        name: { type: String, required: true },
      },
    ],

    message: {
      content: { type: String, required: true },
      subject: { type: String, required: true },
    },

    meta: {
      createdAt: { type: Date, default: Date.now },
    },

    providerResponse: {
      labelIds: [{ type: String }],
      messageId: { type: String },
      success: { type: Boolean, default: false },
      threadId: { type: String },
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

export const NotificacionGmail = model<INotificacionGmail>(
  "Notificaciones-gmail",
  notificacionGmailSchema,
  "notificaciones_gmail"
);
