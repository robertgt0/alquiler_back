import axios from "axios";

type AbstractResp = {
    is_valid_format?: { value: boolean };        // no lo usamos para decidir
    is_mx_found?: { value: boolean };            // tampoco decisivo
    is_smtp_valid?: { value: boolean };          // tampoco decisivo
    is_disposable_email?: { value: boolean };
    is_role_email?: { value: boolean };
    is_catch_all_email?: { value: boolean };
    quality_score?: string;                      // "0.91"
    suggested_correction?: string | null;
    deliverability?: "DELIVERABLE" | "UNDELIVERABLE" | "RISKY" | "UNKNOWN";
};

const ABSTRACT_API_KEY = process.env.ABSTRACT_API_KEY || "";
const ABSTRACT_API_URL =
    process.env.ABSTRACT_API_URL || "https://emailvalidation.abstractapi.com/v1/";
const ABSTRACT_MIN_SCORE = Number(process.env.ABSTRACT_MIN_SCORE ?? 0.7);

export async function validateEmailWithAbstract(email: string) {
    if (!ABSTRACT_API_KEY) throw new Error("ABSTRACT_API_KEY not configured");

    const url = new URL(ABSTRACT_API_URL);
    url.searchParams.set("api_key", ABSTRACT_API_KEY);
    url.searchParams.set("email", email);

    const { data } = await axios.get<AbstractResp>(url.toString(), { timeout: 8000 });

    const score = Number(data.quality_score ?? 0);

    // ✅ Regla de "existencia" estricta
    const ok =
        data.deliverability === "DELIVERABLE" &&
        data.is_catch_all_email?.value === false &&   // bloquea j@gmail.com y similares
        !data.is_disposable_email?.value &&
        !data.is_role_email?.value &&
        score >= ABSTRACT_MIN_SCORE;

    // Mensaje legible
    let reason = "";
    if (data.is_catch_all_email?.value) reason ||= "Dominio accept-all (no se puede confirmar buzón)";
    if (data.deliverability && data.deliverability !== "DELIVERABLE")
        reason ||= `Entregabilidad: ${data.deliverability}`;
    if (data.is_disposable_email?.value) reason ||= "Correo desechable";
    if (data.is_role_email?.value) reason ||= "Correo de rol";
    if (score < ABSTRACT_MIN_SCORE) reason ||= `Baja calidad (${(score * 100).toFixed(0)}%)`;
    if (!ok && data.suggested_correction) {
        reason += reason ? ` — sugerido: ${data.suggested_correction}` : `Sugerido: ${data.suggested_correction}`;
    }

    return { ok, reason, raw: data };
}
