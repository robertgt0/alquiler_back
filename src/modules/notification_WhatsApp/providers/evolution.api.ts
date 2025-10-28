import fetch from "node-fetch";

/**
 * Base URL de Evolution API (ya incluye la instancia)
 * Ejemplo: https://evolution-api-evolution-api.mblz5q.easypanel.host/message/sendText/adri-cuenta
 */
const BASE_URL = process.env.EVOLUTION_API_BASE_URL?.trim().replace(/\/+$/, "") ?? "";
const API_KEY = process.env.EVOLUTION_API_KEY ?? "";
const API_KEY_HEADER = process.env.EVOLUTION_API_KEY_HEADER ?? "apikey"; // por defecto "apikey"

/**
 * Construye encabezados para la solicitud HTTP
 */
function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (API_KEY) {
    headers[API_KEY_HEADER] = API_KEY;
  }

  return headers;
}

/**
 * Envía un mensaje de texto por WhatsApp usando Evolution API
 * @param number Número de teléfono (con código de país, ej. 59171234567)
 * @param text Contenido del mensaje
 */
export async function sendTextViaEvolution({
  number,
  text,
}: {
  number: string;
  text: string;
}): Promise<{ success: boolean; data?: any; error?: any; status?: number }> {
  if (!BASE_URL) {
    return { success: false, error: "❌ EVOLUTION_API_BASE_URL no configurado" };
  }

  if (!number || !text) {
    return { success: false, error: "❌ Falta número o texto para enviar el mensaje" };
  }

  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify({ number, text }),
    });

    const bodyText = await res.text();
    let jsonBody: any;
    try {
      jsonBody = JSON.parse(bodyText);
    } catch {
      jsonBody = bodyText;
    }

    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        data: jsonBody,
        error: jsonBody?.message ?? "Error desconocido en Evolution API",
      };
    }

    return {
      success: true,
      status: res.status,
      data: jsonBody,
    };
  } catch (err: any) {
    return {
      success: false,
      error: `❌ Error de red o conexión con Evolution API: ${err.message ?? err}`,
    };
  }
}
