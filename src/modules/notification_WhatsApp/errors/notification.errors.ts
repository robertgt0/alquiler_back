// src/modules/notification_Gmail/errors/notification.errors.ts
import { AppError } from "./AppError";

/**
 * Errores específicos del dominio de notificaciones Gmail.
 */

export class NotificationNotFoundError extends AppError {
  constructor(id: string) {
    super(`Notificación con ID ${id} no encontrada`, 404, "NOTIFICATION_NOT_FOUND");
  }
}

export class InvalidNotificationDataError extends AppError {
  constructor(details?: any) {
    super("Datos de notificación inválidos", 400, "INVALID_NOTIFICATION_DATA", details);
  }
}

export class NotificationCreationError extends AppError {
  constructor(details?: any) {
    super("No se pudo crear la notificación", 500, "NOTIFICATION_CREATION_ERROR", details);
  }
}

export class NotificationUpdateError extends AppError {
  constructor(id: string, details?: any) {
    super(`Error al actualizar la notificación ${id}`, 500, "NOTIFICATION_UPDATE_ERROR", details);
  }
}

export class NotificationDeletionError extends AppError {
  constructor(id: string, details?: any) {
    super(`Error al eliminar la notificación ${id}`, 500, "NOTIFICATION_DELETION_ERROR", details);
  }
}

export class NotificationProviderError extends AppError {
  constructor(provider: string, details?: any) {
    super(
      `Error con el proveedor de notificación: ${provider} (revisar credenciales OAuth2 o API de Gmail)`,
      500,
      "NOTIFICATION_PROVIDER_ERROR",
      details
    );
  }
}

export class NotificationRateLimitExceededError extends AppError {
  constructor(limit: number, period: string) {
    super(`Se superó el límite de ${limit} notificaciones por ${period}`, 429, "RATE_LIMIT_EXCEEDED");
  }
}

export class NotificationUnauthorizedError extends AppError {
  constructor() {
    super("No autorizado para ejecutar esta acción de notificación", 401, "NOTIFICATION_UNAUTHORIZED");
  }
}

export class NotificationForbiddenError extends AppError {
  constructor() {
    super("Prohibido realizar esta acción de notificación", 403, "NOTIFICATION_FORBIDDEN");
  }
}
