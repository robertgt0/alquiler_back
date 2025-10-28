import { IMessageData, IDestination } from "./Notification";

// =============================================
// 🧩 INTERFACES BASE
// =============================================
export interface NotificationData {
  transactionId?: string;
  source?: "system" | "user";
  message: IMessageData;
  destinations?: IDestination[];
  status?: "draft" | "pending" | "sent" | "failed";
  fromName?: string; // ✅ Añadido para Gmail y WhatsApp
  channel?: "gmail" | "whatsapp"; // ✅ Añadido para distinguir canal
  isRegistration?: boolean; // ✅ Para controlar duplicados
  meta?: {
    provider?: string;
    createdAt?: Date;
    error?: string;
  };
  createdAt?: Date;
  sentAt?: Date;
}

// =============================================
// 🧩 INPUT TIPO (para validaciones y creación)
// =============================================
export interface CreateNotificationInput {
  message: string;
  destinations: IDestination[];
  subject?: string;
  fromName?: string; // ✅ Añadido
  channel?: string; // ✅ Añadido
  isRegistration?: boolean; // ✅ Añadido
}

// =============================================
// 💾 ALMACÉN EN MEMORIA
// =============================================
const memoryStore: NotificationData[] = [];

// ✅ Guarda una notificación en memoria
export async function saveNotification(data: NotificationData) {
  const record: NotificationData = {
    ...data,
    transactionId:
      data.transactionId ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: data.createdAt ?? new Date(),
    sentAt: data.sentAt ?? new Date(),
    meta: {
      provider: data.meta?.provider ?? data.channel ?? "unknown",
      createdAt: data.meta?.createdAt ?? new Date(),
      error: data.meta?.error,
    },
  };

  memoryStore.push(record);
  console.log(
    `💾 [Model] Notificación ${record.channel?.toUpperCase() ?? "GENÉRICA"} guardada:`,
    record.transactionId
  );

  return record;
}

// ✅ Devuelve todas las notificaciones guardadas
export async function listNotifications() {
  return memoryStore;
}
