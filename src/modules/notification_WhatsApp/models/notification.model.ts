import mongoose, { Document, Schema } from "mongoose";
import connectDB from "../config/database"; // ✅ conexión central, igual que Gmail

// ✅ Conecta si aún no hay conexión activa
if (!mongoose.connection.readyState) {
  connectDB(); // sin await → se conecta en segundo plano
}

// =============================================
// 💬 INTERFACES
// =============================================
export type NotificationChannel = "whatsapp";

export interface IMessageData {
  type?: string;
  content: string;
  template?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDestination {
  name?: string;
  phone: string;
}

export interface INotificationPackage extends Document {
  transactionId?: string;
  channel: NotificationChannel;
  message: IMessageData;
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
    phone: { type: String, required: true },
  },
  { _id: false }
);

const NotificationSchema = new Schema<INotificationPackage>(
  {
    transactionId: String,
    channel: { type: String, enum: ["whatsapp"], default: "whatsapp" },
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
  { collection: "notificaciones_whatsapp" }
);

// =============================================
// 📦 MODELO (evita redefinir si ya existe)
// =============================================
export const WhatsAppNotificationModel =
  mongoose.models.WhatsAppNotification ||
  mongoose.model<INotificationPackage>(
    "WhatsAppNotification",
    NotificationSchema
  );

// =============================================
// 💾 FUNCIONES
// =============================================
export async function saveNotification(data: Partial<INotificationPackage>) {
  const record = new WhatsAppNotificationModel({
    ...data,
    createdAt: new Date(),
  });
  await record.save();
  console.log("✅ [MongoDB] Notificación WhatsApp registrada:", record._id);
  return record;
}

export async function listNotifications() {
  return WhatsAppNotificationModel.find().sort({ createdAt: -1 });
}
