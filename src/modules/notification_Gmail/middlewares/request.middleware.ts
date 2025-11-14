import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import { logSystem } from "../utils/loggerExtended";

/** Registra inicio/fin de cada request con un requestId y duración */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
    const id = randomUUID();
    (req as any).requestId = id;
    const start = Date.now();

    logSystem("INFO", "request:start", {
        id,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
    });

    res.on("finish", () => {
        logSystem("INFO", "request:finish", {
            id,
            status: res.statusCode,
            method: req.method,
            url: req.originalUrl,
            duration: Date.now() - start,
        });
    });

    next();
}
