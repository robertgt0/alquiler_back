import axios from "axios";

/**
 * Envía una notificación al webhook de n8n.
 * Usa las variables de entorno definidas en .env
 */
export async function triggerN8nWebhook(data: {
  to: string;
  subject: string;
  message: string;
  id?: string;
  type?: string;
}) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL!;
  const timeout = Number(process.env.N8N_TIMEOUT_MS ?? 10000);
  const maxRetries = Number(process.env.N8N_MAX_RETRIES ?? 3);
  const retryDelay = Number(process.env.N8N_RETRY_DELAY_MS ?? 5000);

  let lastError: any = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🚀 [n8n.provider] Intento ${attempt}/${maxRetries}: enviando a ${webhookUrl}`);

      const response = await axios.post(webhookUrl, data, { timeout });
      console.log("✅ [n8n.provider] Webhook ejecutado correctamente");

      return {
        success: true,
        status: response.status,
        data: response.data,
      };
    } catch (error: any) {
      lastError = error;
      console.error(`⚠️ [n8n.provider] Error intento ${attempt}:`, error.message);

      if (attempt < maxRetries) {
        console.log(`⏳ Reintentando en ${retryDelay}ms...`);
        await new Promise((r) => setTimeout(r, retryDelay));
      }
    }
  }

  console.error("❌ [n8n.provider] Fallaron todos los intentos:", lastError?.message);
  return {
    success: false,
    message: lastError?.message || "Error desconocido al llamar al webhook",
    error: lastError,
  };
}
