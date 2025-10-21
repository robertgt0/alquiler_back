// src/modules/notification/services/notification.demo.service.ts
import axios from 'axios';
import { DemoWorkflow } from '../workflows/demo.workflow';

export class NotificationDemoService {
  static async sendDemoNotification(data: {
    to: string;
    subject: string;
    message: string;
  }) {
    try {
      const response = await axios.post(DemoWorkflow.webhookUrl, data);
      console.log('Respuesta n8n:', response.data);
      return { ok: true, data: response.data };
    } catch (error: any) {
      console.error('Error enviando a n8n:', error.message);
      return { ok: false, error: error.message };
    }
  }
}
