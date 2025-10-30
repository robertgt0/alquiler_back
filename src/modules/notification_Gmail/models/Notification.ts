// src/modules/notification/models/Notification.ts
import mongoose, { Document, Schema } from "mongoose";

// ======== INTERFACES ========

// ✅ Tipos de canal soportados
export type NotificationChannel = "email" | "sms" | "push" | "gmail-api";

// ✅ Mensaje base
export interface IMessageData {
  id?: string;
  type: NotificationChannel;
  subject?: string;
  content: string;
  template?: string;
  variables?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

// ✅ Destino del mensaje
export interface IDestination {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  deviceToken?: string;
  preferences?: {
    channels?: NotificationChannel[];
    language?: string;
    timezone?: string;
  };
}

// ✅ Paquete completo de notificación
export interface INotificationPackage extends Document {
  id?: string;
  source: "system" | "user";
  message: IMessageData;
  destinations: IDestination[];
  priority?: "low" | "medium" | "high";
  status: "draft" | "pending" | "sent" | "failed";
  createdAt: Date;
  scheduledFor?: Date | null;
}

// ======== ESQUEMAS ========

// Subdocumento mensaje
const MessageSchema = new Schema<IMessageData>(
  {
    type: {
      type: String,
      enum: ["email", "sms", "push", "gmail-api"], // ✅ agregado gmail-api
      required: true,
    },
    subject: String,
    content: { type: String, required: true },
    template: String,
    variables: { type: Schema.Types.Mixed },
    createdAt: Date,
    updatedAt: Date,
  },
  { _id: false }
);

// Subdocumento destino
const DestinationSchema = new Schema<IDestination>(
  {
    id: String,
    name: String,
    email: String,
    phone: String,
    deviceToken: String,
    preferences: { type: Schema.Types.Mixed },
  },
  { _id: false }
);

// Esquema principal
const NotificationSchema = new Schema<INotificationPackage>({
  id: String,
  source: { type: String, enum: ["system", "user"], default: "user" },
  message: { type: MessageSchema, required: true },
  destinations: { type: [DestinationSchema], required: true },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  status: {
    type: String,
    enum: ["draft", "pending", "sent", "failed"],
    default: "pending",
  },
  createdAt: { type: Date, default: () => new Date() },
  scheduledFor: Date,
});

// Export del modelo
export const NotificationModel =
  mongoose.models.Notification ||
  mongoose.model<INotificationPackage>("Notification", NotificationSchema);
