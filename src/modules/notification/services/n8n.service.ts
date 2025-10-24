import fetch from "node-fetch";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL!; // <= usa .env, no valor fijo
const N8N_TIMEOUT_MS = Number(process.env.N8N_TIMEOUT_MS || 10000);

export async function triggerN8nWebhook(payload: Record<string, any>) {
    if (!N8N_WEBHOOK_URL) {
        return { success: false, httpStatus: 500, error: "N8N_WEBHOOK_URL not set" };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), N8N_TIMEOUT_MS);

    const res = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal as any,
    }).finally(() => clearTimeout(timeout));

    let data: any = {};
    try { data = await res.json(); } catch { /* noop */ }

    // devolvemos todo tal cual
    return {
        success: res.ok && data?.success !== false,
        httpStatus: res.status,
        message: data?.message,
        error: data?.error,
        details: data?.details,
        data,
    };
}
