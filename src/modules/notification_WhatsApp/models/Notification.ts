import mongoose, { Document, Schema } from "mongoose";

// ======== INTERFACES ========

// ✅ Tipos de canal soportados
export type NotificationChannel = "whatsapp";

// ✅ Mensaje base
export interface IMessageData {
  id?: string;
  type: NotificationChannel;
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
  phone: string; // ✅ obligatorio para WhatsApp
  preferences?: {
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
      enum: ["whatsapp"],
      required: true,
    },
    content: { type: String, required: true },
    template: String,
    variables: { type: Schema.Types.Mixed },
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: Date,
  },
  { _id: false }
);

// Subdocumento destino
const DestinationSchema = new Schema<IDestination>(
  {
    id: String,
    name: String,
    phone: { type: String, required: true },
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
