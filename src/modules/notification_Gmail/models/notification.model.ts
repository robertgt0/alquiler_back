// src/modules/notifications/models/notification.model.ts
import { NotificationData } from "../types/notification.types";

const memoryStore: NotificationData[] = [];

// ✅ Guarda una notificación en memoria
export async function saveNotification(data: NotificationData) {
  const record: NotificationData = {
    ...data,

    // ✅ Genera ID de transacción si no viene
    transactionId:
      data.transactionId ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,

    // ✅ Asegura fecha de creación
    createdAt: data.sentAt ?? new Date(),

    // ✅ Asegura meta con fecha y proveedor
    meta: {
      ...(data.meta ?? {}),
      provider: data.meta?.provider ?? "gmail-api",
      createdAt: data.meta?.createdAt ?? new Date(),
    },
  } as NotificationData;

  memoryStore.push(record);
  console.log("💾 [Model] Notificación guardada en memoria");
  return record;
}

// ✅ Devuelve todas las notificaciones guardadas
export async function listNotifications() {
  return memoryStore;
}
