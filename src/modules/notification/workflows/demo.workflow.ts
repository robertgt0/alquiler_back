// src/modules/notification/workflows/demo.workflow.ts
export const DemoWorkflow = {
  name: 'Demo Notificación n8n',
  description: 'Flujo de demostración que envía una notificación a través de n8n',
  webhookUrl: process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/demo-notification',
};
