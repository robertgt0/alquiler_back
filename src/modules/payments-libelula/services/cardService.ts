import fetch from "node-fetch";

const LIBELULA_URL = "https://api.libelula.bo/rest/deuda/registrar";
const APP_KEY = "11bb10ce-68ba-4af1-8eb7-4e6624fed729"; 

export const registrarDeuda = async (payload: any) => {
  try {
    const response = await fetch(LIBELULA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "APP-KEY": APP_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error:", errorText);
      throw new Error("Error en la API de Libélula");
    }

    const data = await response.json();
    console.log("Respuesta:", data);
    return data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
};
