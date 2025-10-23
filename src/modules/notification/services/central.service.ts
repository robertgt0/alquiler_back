import { v4 as uuidv4 } from "uuid";
import { saveNotification } from "../models/notification.model";
import { triggerN8nWebhook } from "./n8n.service";
import { 
  InvalidNotificationDataError,
  NotificationCreationError,
  NotificationProviderError
} from "../errors/notification.errors";

interface Destination {
  email: string;
  name?: string;
}

interface CreateNotificationInput {
  subject: string;
  message: string;
  destinations: Destination[];
  type?: string;
  fromName?: string; 
}

export class CentralNotificationService {
  async receiveAndSend(data: CreateNotificationInput) {
    this.validatePayload(data);

    const transactionId = uuidv4();
    const toEmails = data.destinations.map((d) => d.email);

    try {
      const notification = await saveNotification({
        transactionId,
        subject: data.subject,
        message: data.message,
        destinations: data.destinations,
        channel: "n8n",
        status: "pending",
        meta: {
          createdAt: new Date()
        },
        attempts: 1
      });


      try {
        const result = await triggerN8nWebhook({
          fixerEmail: toEmails[0],
          subject: data.subject,
          message: data.message,
          id: notification.transactionId ?? transactionId,
          type: data.type ?? "generic",
        });

        // Update notification status based on result
        notification.status = result.success ? "sent" : "failed";
        notification.providerResponse = result;
        notification.sentAt = new Date();

        return {
          success: result.success,
          transactionId,
          status: notification.status,
          response: result,
        };
      } catch (error) {
        // Handle provider-specific errors
        notification.status = "failed";
        notification.error = error instanceof Error ? error.message : String(error);
        
        throw new NotificationProviderError(
          'n8n', 
          error instanceof Error ? error.message : 'Unknown provider error'
        );
      }
    } catch (error) {
      if (error instanceof NotificationProviderError) {
        throw error; // Re-throw already handled provider errors
      }
      
      throw new NotificationCreationError(
        error instanceof Error ? error.message : 'Failed to create notification'
      );
    }
  }

  private validatePayload(data: CreateNotificationInput): void {
    if (!data) {
      throw new InvalidNotificationDataError({
        message: "Payload cannot be empty"
      });
    }
    
    const errors: Record<string, string> = {};
    
    if (!data.subject || typeof data.subject !== "string") {
      errors.subject = "Subject is required and must be a string";
    }
    
    if (!data.message || typeof data.message !== "string") {
      errors.message = "Message is required and must be a string";
    }
    
    if (!Array.isArray(data.destinations) || data.destinations.length === 0) {
      errors.destinations = "At least one destination is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      data.destinations.forEach((d, index) => {
        if (!d.email || !emailRegex.test(d.email)) {
          errors[`destinations[${index}].email`] = "Invalid email format";
        }
      });
    }
    
    if (Object.keys(errors).length > 0) {
      throw new InvalidNotificationDataError({
        message: "Invalid notification data",
        details: errors
      });
    }
  }
}
