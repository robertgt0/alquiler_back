import mongoose, { Document, Schema } from "mongoose";
import connectDB from "../config/database"; // ⬅️ Importa la función, no "dbConnection"

// ✅ Conecta si aún no hay conexión activa
if (!mongoose.connection.readyState) {
  connectDB(); // sin await → se conecta en segundo plano
}

// =============================================
// 📧 INTERFACES
// =============================================
export type NotificationChannel = "gmail-api";

export interface IMessageData {
  subject?: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDestination {
  name?: string;
  email: string;
}

export interface INotificationPackage extends Document {
  transactionId?: string;
  channel: NotificationChannel;
  message: string | IMessageData;
  destinations: IDestination[];
  status: "draft" | "pending" | "sent" | "failed";
  meta?: Record<string, any>;
  attempts?: number;
  providerResponse?: any;
  sentAt?: Date;
  createdAt: Date;
}

// =============================================
// 🧱 ESQUEMA
// =============================================
const DestinationSchema = new Schema<IDestination>(
  {
    name: String,
    email: { type: String, required: true },
  },
  { _id: false }
);

const NotificationSchema = new Schema<INotificationPackage>(
  {
    transactionId: String,
    channel: { type: String, enum: ["gmail-api"], default: "gmail-api" },
    message: Schema.Types.Mixed,
    destinations: { type: [DestinationSchema], required: true },
    status: {
      type: String,
      enum: ["draft", "pending", "sent", "failed"],
      default: "pending",
    },
    meta: { type: Schema.Types.Mixed },
    attempts: Number,
    providerResponse: Schema.Types.Mixed,
    sentAt: Date,
    createdAt: { type: Date, default: () => new Date() },
  },
  { collection: "notificaciones_gmail" }
);

// =============================================
// 📦 MODELO (evita redefinir si ya existe)
// =============================================
export const GmailNotificationModel =
  mongoose.models.GmailNotification ||
  mongoose.model<INotificationPackage>(
    "GmailNotification",
    NotificationSchema
  );

// =============================================
// 💾 FUNCIONES
// =============================================
export async function saveNotification(data: Partial<INotificationPackage>) {
  const record = new GmailNotificationModel({
    ...data,
    createdAt: new Date(),
  });
  await record.save();
  console.log("✅ [MongoDB] Notificación Gmail registrada:", record._id);
  return record;
}

export async function listNotifications() {
  return GmailNotificationModel.find().sort({ createdAt: -1 });
}
