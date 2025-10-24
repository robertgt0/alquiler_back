// src/modules/notifications/services/n8n.service.ts
import fetch from "node-fetch";
import { logNotification } from "../../../utils/logger"; // ⚠️ ajusta la ruta si cambia

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "https://dev-recode.app.n8n.cloud/webhook/notify-email";
const N8N_TIMEOUT_MS = Number(process.env.N8N_TIMEOUT_MS || 10000);
const N8N_MAX_RETRIES = Number(process.env.N8N_MAX_RETRIES || 3);
const N8N_RETRY_DELAY_MS = Number(process.env.N8N_RETRY_DELAY_MS || 5000);

function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function triggerN8nWebhook(payload: Record<string, any>) {
  if (!N8N_WEBHOOK_URL) {
    logNotification(
      payload.fixerEmail ?? "desconocido",
      "ERROR",
      "sin-tx",
      "N8N_WEBHOOK_URL no configurado"
    );
    return {
      success: false,
      status: "no_webhook_configured",
      message: "N8N_WEBHOOK_URL no configurado",
    };
  }

  let attempt = 0;
  let lastError: any = null;

  while (attempt < N8N_MAX_RETRIES) {
    attempt++;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), N8N_TIMEOUT_MS);

      const res = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal as any,
      });

      clearTimeout(timeout);

      const text = await res.text();
      let data: any;
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { raw: text };
      }

      // ✅ Si la petición fue exitosa
      if (res.ok) {
        const statusLower = (data?.status ?? "").toLowerCase();

        // 🚫 Si n8n indica que el correo no existe o es inválido
        if (statusLower.includes("undeliverable") || statusLower.includes("invalid")) {
          console.warn("📭 Correo no existente detectado por n8n:", payload.to);

          // No registrar en logs, solo devolver error
          return {
            success: false,
            status: "undeliverable",
            message: data?.message ?? "El correo no existe o es inválido",
            data,
          };
        }

        // ✅ Si todo bien, registrar y devolver éxito
        logNotification(
          payload.fixerEmail ?? "sin-email",
          "OK",
          payload.id ?? `n8n-${Date.now()}`,
          `Intento #${attempt} | HTTP ${res.status}`
        );

        return {
          success: true,
          status: "ok",
          httpStatus: res.status,
          data,
        };
      }

      // ❌ Si el servidor respondió con error HTTP
      logNotification(
        payload.fixerEmail ?? "sin-email",
        "HTTP_ERROR",
        payload.id ?? `n8n-${Date.now()}`,
        `Intento #${attempt} | Código: ${res.status} | Mensaje: ${data?.message ?? "Error HTTP"}`
      );

      return {
        success: false,
        status: "http_error",
        httpStatus: res.status,
        data,
        message: data?.message ?? "HTTP error",
      };

    } catch (err: any) {
      lastError = err;

      // ⚠️ Error de red o timeout
      logNotification(
        payload.fixerEmail ?? "sin-email",
        "NETWORK_ERROR",
        payload.id ?? `n8n-${Date.now()}`,
        `Intento #${attempt} | Error: ${err?.message ?? err}`
      );

      if (attempt < N8N_MAX_RETRIES) {
        await wait(N8N_RETRY_DELAY_MS);
        continue;
      }

      return {
        success: false,
        status: "network_error",
        error: String(err?.message ?? err),
      };
    }
  }

  // ❌ Si fallaron todos los intentos
  logNotification(
    payload.fixerEmail ?? "sin-email",
    "FAILED",
    payload.id ?? `n8n-${Date.now()}`,
    `Error final: ${lastError?.message ?? lastError}`
  );

  return {
    success: false,
    status: "failed",
    error: lastError?.message ?? lastError,
  };
}
