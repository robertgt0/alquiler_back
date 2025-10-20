// src/modules/notifications/models/notification.model.ts
import { NotificationData } from '../types/notification.types';

/**
 * Implementación mínima: almacenamiento en memoria para pruebas.
 * Reemplaza por persistencia real (Mongo/Postgres) si lo necesitas.
 */

const memoryStore: NotificationData[] = [];

export async function saveNotification(data: NotificationData) {
  // Simular async (por si luego cambias a DB real)
  memoryStore.push({ ...data });
  console.log('💾 [Model] Notificación guardada en memoria (solo para pruebas)');
  return data;
}

export async function listNotifications() {
  return memoryStore;
}

