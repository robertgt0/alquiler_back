import { Response, NextFunction } from 'express';
import { AppError } from './AppError';
import { 
  NotificationNotFoundError,
  InvalidNotificationDataError,
  NotificationCreationError,
  NotificationUpdateError,
  NotificationDeletionError,
  NotificationProviderError,
  NotificationRateLimitExceededError,
  NotificationUnauthorizedError,
  NotificationForbiddenError
} from './notification.errors';

export const errorHandler = (error: Error, _req: any, res: Response, _next: NextFunction): void => {
  console.error('Error:', error);

  // Handle known AppError instances
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      code: error.code,
      message: error.message,
      ...(error.details && { details: error.details })
    });
    return;
  }

  // Handle specific error types
  if (error.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      code: 'VALIDATION_ERROR',
      message: 'Error de validación',
      details: error.message,
    });
    return;
  }

  if (error.name === 'CastError') {
    res.status(400).json({
      success: false,
      code: 'INVALID_ID',
      message: 'ID inválido',
    });
    return;
  }

  if (error.name === 'MongoError' && (error as any).code === 11000) {
    res.status(409).json({
      success: false,
      code: 'DUPLICATE_KEY',
      message: 'Duplicate key error',
      details: error.message,
    });
    return;
  }

  // Handle unhandled errors
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

// Helper function to handle async/await errors
export const asyncHandler = (fn: Function) => 
  (req: any, res: Response, next: NextFunction) => 
    Promise.resolve(fn(req, res, next)).catch(next);