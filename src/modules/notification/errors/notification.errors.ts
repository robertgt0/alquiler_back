import { AppError } from './AppError';

export class NotificationNotFoundError extends AppError {
  constructor(id: string) {
    super(`Notification with id ${id} not found`, 404, 'NOTIFICATION_NOT_FOUND');
  }
}

export class InvalidNotificationDataError extends AppError {
  constructor(details?: any) {
    super('Invalid notification data', 400, 'INVALID_NOTIFICATION_DATA', details);
  }
}

export class NotificationCreationError extends AppError {
  constructor(details?: any) {
    super('Failed to create notification', 500, 'NOTIFICATION_CREATION_ERROR', details);
  }
}

export class NotificationUpdateError extends AppError {
  constructor(id: string, details?: any) {
    super(`Failed to update notification ${id}`, 500, 'NOTIFICATION_UPDATE_ERROR', details);
  }
}

export class NotificationDeletionError extends AppError {
  constructor(id: string, details?: any) {
    super(`Failed to delete notification ${id}`, 500, 'NOTIFICATION_DELETION_ERROR', details);
  }
}

export class NotificationProviderError extends AppError {
  constructor(provider: string, details?: any) {
    super(`Error with notification provider: ${provider}`, 500, 'NOTIFICATION_PROVIDER_ERROR', details);
  }
}

export class NotificationRateLimitExceededError extends AppError {
  constructor(limit: number, period: string) {
    super(`Notification rate limit of ${limit} per ${period} exceeded`, 429, 'RATE_LIMIT_EXCEEDED');
  }
}

export class NotificationUnauthorizedError extends AppError {
  constructor() {
    super('Unauthorized to perform this notification action', 401, 'NOTIFICATION_UNAUTHORIZED');
  }
}

export class NotificationForbiddenError extends AppError {
  constructor() {
    super('Forbidden to perform this notification action', 403, 'NOTIFICATION_FORBIDDEN');
  }
}
