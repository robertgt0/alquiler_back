/**
 * =============================================================
 * Tarea 1: Definición del modelo de paquete de datos
 * Repositorio: alquiler_back
 * Responsable: Cristhian Erwin Calizaya Mamani
 * Descripción: Este archivo define los modelos de datos (tipos e interfaces)
 * para representar los mensajes y destinos dentro del sistema de notificaciones.
 * No implementa lógica de envío ni conexión con proveedores externos.
 * =============================================================
 */

// ==================== MODELO DE MENSAJE ====================

/**
 * Representa la información básica de un mensaje de notificación.
 */
export interface MessageData {
  id: string;                     // Identificador único del mensaje
  type: 'email' | 'sms' | 'push'; // Tipo de mensaje o canal
  subject?: string;               // Asunto (solo para email)
  content: string;                // Cuerpo o contenido principal
  template?: string;              // Nombre de plantilla (opcional)
  variables?: Record<string, any>; // Variables dinámicas (para plantillas)
  createdAt: Date;                // Fecha de creación
  updatedAt?: Date;               // Fecha de última actualización
}

// ==================== MODELO DE DESTINATARIO ====================

/**
 * Representa un destinatario de una notificación (usuario final).
 */
export interface Destination {
  id?: string;                     // ID interno del destinatario (si existe)
  name?: string;                   // Nombre del destinatario
  email?: string;                  // Correo electrónico
  phone?: string;                  // Número de teléfono
  deviceToken?: string;            // Token para notificaciones push
  preferences?: {
    channels?: ('email' | 'sms' | 'push')[]; // Canales preferidos
    language?: string;             // Idioma preferido ('es', 'en', etc.)
    timezone?: string;             // Zona horaria ('America/La_Paz', etc.)
  };
}

// ==================== MODELO PRINCIPAL DEL PAQUETE ====================

/**
 * Representa el paquete completo de datos que se enviará al sistema de notificaciones.
 */
export interface NotificationPackage {
  id: string;                        // ID único del paquete
  source: 'system' | 'user';         // Origen de la notificación
  message: MessageData;              // Información del mensaje
  destinations: Destination[];       // Lista de destinatarios
  priority?: 'low' | 'medium' | 'high'; // Nivel de prioridad
  status: 'draft' | 'pending' | 'sent' | 'failed'; // Estado del paquete
  createdAt: Date;                   // Fecha de creación
  scheduledFor?: Date;               // Fecha programada (si aplica)
}
