// src/modules/payments-libelula/services/cardService.ts
import fetch from "node-fetch";

const LIBELULA_URL = "https://api.libelula.bo/rest/deuda/registrar";
const APP_KEY = "TU_APPKEY_DE_LIBELULA"; // ⚠️ tu APPKEY real de pruebas o sandbox

export const registrarDeuda = async (payload: any) => {
  try {
    const response = await fetch(LIBELULA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "APP-KEY": APP_KEY, // 👈 algunos endpoints requieren mayúsculas exactas
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error de Libélula:", errorText);
      throw new Error("Error en la API de Libélula");
    }

    const data = await response.json();
    console.log("✅ Respuesta de Libélula:", data);
    return data;
  } catch (err) {
    console.error("❌ Error al conectar con Libélula:", err);
    throw err;
  }
};
