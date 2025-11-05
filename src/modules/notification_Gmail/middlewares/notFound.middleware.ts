import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

/** 404: envía un AppError al manejador global */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
    next(new AppError(`Ruta no encontrada: ${req.originalUrl}`, 404, "NOT_FOUND"));
}
