import { Request, Response, NextFunction } from "express";
import { logSystem } from "../utils/loggerExtended";
import { logNotification } from "../utils/logger";

/** Manejo global de errores: responde uniforme y loguea en ambos logs */
export function globalErrorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
    const status = err.statusCode || 500;
    const code = err.code || "INTERNAL_ERROR";
    const message = err.message || "Error interno del servidor";

    const to = req.body?.destinations?.[0]?.email || "N/A";
    const txId = req.body?.transactionId || "N/A";

    // a tu send_log.txt
    logNotification(to, "ERROR", txId, `${code}: ${message}`);

    // al system_log.txt (estructurado)
    logSystem("ERROR", message, {
        code,
        status,
        endpoint: req.originalUrl,
        method: req.method,
        ip: req.ip,
        requestId: (req as any).requestId || "N/A",
        userAgent: req.headers["user-agent"] || "N/A",
    });

    res.status(status).json({
        ok: false,
        error: { code, message },
        context: {
            endpoint: req.originalUrl,
            method: req.method,
            requestId: (req as any).requestId || "N/A",
        },
    });
}
