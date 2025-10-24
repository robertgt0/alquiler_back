import { v4 as uuidv4 } from "uuid";
import { saveNotification } from "../models/notification.model";
import { triggerN8nWebhook } from "./n8n.service";

interface Destination { email: string; name?: string; }
interface CreateNotificationInput {
    subject: string; message: string; destinations: Destination[]; type?: string; fromName?: string;
}

export class CentralNotificationService {
    async receiveAndSend(data: CreateNotificationInput) {
        // (si quieres, aquí dejas tus validaciones de formato, no de existencia)

        const transactionId = uuidv4();
        const toEmails = data.destinations.map(d => d.email);

        const notification = await saveNotification({
            transactionId,
            subject: data.subject,
            message: data.message,
            destinations: data.destinations,
            channel: "n8n",
            status: "pending",
            meta: { createdAt: new Date() },
            attempts: 1,
        });

        const result = await triggerN8nWebhook({
            fixerEmail: toEmails[0],
            subject: data.subject,
            message: data.message,
            id: notification.transactionId ?? transactionId,
            type: data.type ?? "generic",
        });

        notification.status = result.success ? "sent" : "failed";
        notification.providerResponse = result;
        notification.sentAt = new Date();

        return {
            success: result.success,
            transactionId,
            status: notification.status,
            httpStatus: result.httpStatus,   // <= propaga el status real
            message: result.message,
            error: result.error,
            details: result.details,
            response: result,
        };
    }
}
