import { Request, Response } from "express";
import { CentralNotificationService } from "../services/central.service";

const central = new CentralNotificationService();

export async function createNotification(req: Request, res: Response) {
    try {
        const payload = req.body;

        const destinations =
            Array.isArray(payload.destinations) && payload.destinations.length > 0
                ? payload.destinations
                : payload.fixerEmail
                    ? [{ email: payload.fixerEmail }]
                    : [];

        if (!destinations.length) {
            return res.status(400).json({ success: false, error: "MISSING_DESTINATIONS" });
        }

        const result = await central.receiveAndSend({
            subject: payload.subject,
            message: payload.message,
            destinations,
            type: payload.type,
        });

        const status = result.httpStatus ?? (result.success ? 200 : 422);
        return res.status(status).json(result);
    } catch (e: any) {
        return res.status(500).json({ success: false, message: e?.message ?? "Error interno" });
    }
}
