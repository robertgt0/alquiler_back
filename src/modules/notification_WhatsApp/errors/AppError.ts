// src/modules/notification_Gmail/errors/appError.ts

export class AppError extends Error {
  statusCode: number;
  code: string;
  isOperational = true;
  details?: any;

  constructor(message: string, statusCode = 500, code = "INTERNAL_ERROR", details?: any) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace?.(this, this.constructor);
  }
}
