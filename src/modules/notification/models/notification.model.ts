// src/modules/notifications/models/notification.model.ts
import { NotificationData } from "../types/notification.types";

const memoryStore: NotificationData[] = [];

export async function saveNotification(data: NotificationData) {
  const record: NotificationData = {
    ...data,
    transactionId: data.transactionId ?? (Date.now() + '-' + Math.random()).toString(),
    createdAt: data.sentAt ?? new Date(), // createdAt no estaba en interface, ok si lo añades en meta
  } as any;
  memoryStore.push(record);
  console.log("💾 [Model] Notificación guardada en memoria");
  return record;
}

export async function listNotifications() {
  return memoryStore;
}
