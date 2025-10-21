// src/modules/notification/services/n8n.service.ts
import fetch from 'node-fetch';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || '';
const N8N_TIMEOUT_MS = Number(process.env.N8N_TIMEOUT_MS || 10000);
const N8N_MAX_RETRIES = Number(process.env.N8N_MAX_RETRIES || 3);
const N8N_RETRY_DELAY_MS = Number(process.env.N8N_RETRY_DELAY_MS || 5000);

if (!N8N_WEBHOOK_URL) {
  console.warn('⚠️ N8N_WEBHOOK_URL no configurado en .env — llamadas a n8n no funcionarán.');
}

function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function triggerN8nWebhook(payload: Record<string, any>) {
  if (!N8N_WEBHOOK_URL) {
    return { success: false, status: 'no_webhook_configured', message: 'N8N_WEBHOOK_URL no configurado' };
  }

  let attempt = 0;
  let lastError: any = null;

  while (attempt < N8N_MAX_RETRIES) {
    attempt++;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), N8N_TIMEOUT_MS);

      const res = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const text = await res.text();
      // Si responde JSON, parsearlo; si no, devolver texto
      let data: any;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        data = { raw: text };
      }

      if (res.ok) {
        return { success: true, status: 'ok', httpStatus: res.status, data };
      } else {
        // HTTP 4xx/5xx
        return { success: false, status: 'http_error', httpStatus: res.status, data, message: data?.message ?? 'HTTP error' };
      }
    } catch (err: any) {
      lastError = err;
      // Si se agotó el timeout o fallo de red, reintentar según política
      if (attempt < N8N_MAX_RETRIES) {
        await wait(N8N_RETRY_DELAY_MS);
        continue;
      }
      // último intento fallido
      return { success: false, status: 'network_error', error: String(err?.message ?? err) };
    }
  }

  return { success: false, status: 'failed', error: lastError?.message ?? lastError };
}
