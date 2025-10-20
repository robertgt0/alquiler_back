import axios from "axios";
import fs from "fs";
import path from "path";

const logFile = path.join(process.cwd(), "logs", "n8n.log");

/**
 * Escribe una entrada en la bitácora local (logs/n8n.log)
 */
function writeN8nLog(entry: any) {
    try {
        fs.mkdirSync(path.dirname(logFile), { recursive: true });
        fs.appendFileSync(
            logFile,
            JSON.stringify({ ts: new Date().toISOString(), ...entry }) + "\n"
        );
    } catch (err) {
        console.error("[n8n] Error al escribir log:", err);
    }
}

/**
 * Envía un payload al webhook de n8n y registra los resultados.
 */
export async function triggerN8n(payload: any) {
    const url = process.env.N8N_WEBHOOK_URL;
    const secret = process.env.N8N_WEBHOOK_SECRET;
    const timeout = Number(process.env.N8N_TIMEOUT_MS ?? 60000); // 60s por defecto

    // Caso 1: Sin URL configurada
    if (!url) {
        const entry = {
            event: "n8n-trigger",
            success: false,
            status: "not_configured",
            reason: "N8N_WEBHOOK_URL not configured",
        };
        writeN8nLog(entry);
        console.warn("[n8n] N8N_WEBHOOK_URL not configured, skipping trigger.");
        return entry;
    }

    try {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (secret) headers["X-Webhook-Secret"] = secret;

        const res = await axios.post(url, payload, { headers, timeout });

        const responseData =
            typeof res.data === "object" ? res.data : { raw: String(res.data) };

        // Caso 2: Respuesta exitosa (200 o 201)
        if (res.status >= 200 && res.status < 300) {
            const entry = {
                event: "n8n-trigger",
                success: true,
                status: res.status,
                message: "Webhook triggered successfully",
                url,
                response: responseData,
            };
            writeN8nLog(entry);
            console.log("[n8n] Webhook triggered successfully ✅", entry);
            return entry;
        }

        // Caso 3: Respuesta HTTP no exitosa
        const entry = {
            event: "n8n-trigger",
            success: false,
            status: res.status,
            reason: "n8n responded with non-success status",
            url,
            response: responseData,
        };
        writeN8nLog(entry);
        console.warn("[n8n] Webhook responded with non-2xx ⚠️", entry);
        return entry;

    } catch (err: any) {
        const msg = err?.response?.data ?? err.message ?? String(err);

        // Caso 4: Timeout o error de conexión
        const isTimeout = msg.includes("timeout");
        const entry = {
            event: "n8n-trigger",
            success: false,
            status: isTimeout ? "timeout" : "error",
            reason: isTimeout
                ? "Timeout exceeded waiting for n8n response"
                : msg,
            url,
        };
        writeN8nLog(entry);
        console.error("[n8n] Error triggering webhook ❌", entry);
        return entry;
    }
}
