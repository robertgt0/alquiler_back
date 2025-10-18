// src/modules/notifications/models/notification.types.ts

export type NotificationStatus = "pending" | "sent" | "failed";

export type NotificationChannel = "email" | "sms" | "push"; // para futuras extensiones

// Estructura del destinatario (destino)
export interface Destination {
  email?: string;          // email del destinatario (si channel === 'email')
  phone?: string;          // número si es sms (opcional para futuro)
  name?: string;           // nombre opcional
}

// Paquete de datos principal que recibirá el endpoint
export interface NotificationPayload {
  message: string;         // cuerpo del mensaje (texto / html)
  subject: string;         // asunto (para email)
  destinations: Destination[]; // lista de destinatarios (mínimo 1)
  type?: string;           // tipo de notificación (ej: "alquiler_recordatorio")
  channel?: NotificationChannel; // canal a usar (email por defecto)
  metadata?: Record<string, any>; // datos arbitrarios (por ejemplo: {rentalId: "..."})
}

// Documento de persistencia y trazabilidad
export interface NotificationDoc extends NotificationPayload {
  //_id?: string;            // id generado por DB (ObjectId en Mongo)
  transactionId: string;   // id único rastreable (UUID / string)
  status: NotificationStatus; // estado actual
  attempts: number;        // intentos realizados
  lastError?: string | null; // ultimo error textual si ocurrió
  providerResponse?: any;  // respuesta cruda del proveedor (Gmail/nodemailer)
  createdAt?: Date;
  updatedAt?: Date;
  sentAt?: Date | null;    // timestamp si fue enviado
}
