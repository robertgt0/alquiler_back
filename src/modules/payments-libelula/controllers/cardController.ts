import { Request, Response } from "express";

const LIBELULA_API = "https://api.libelula.bo/rest/deuda/registrar";
const APPKEY = process.env.LIBELULA_APPKEY || "TU_APPKEY_DE_PRUEBAS";

export const registrarDeudaController = async (req: Request, res: Response) => {
  try {
    const { card_number, expiry_month, expiry_year, cvc, cardholder_name } = req.body;

    console.log("📨 Enviando datos a Libélula...");
    console.log(req.body);

    const response = await fetch(LIBELULA_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "APPKEY": APPKEY,
      },
      body: JSON.stringify({
        card_number,
        expiry_month,
        expiry_year,
        cvc,
        cardholder_name,
      }),
    });

    const data = await response.json();

    console.log("✅ Respuesta Libélula:", data);
    res.status(response.status).json(data);

  } catch (err: any) {
    console.error("❌ Error al conectar con Libélula:", err);
    res.status(500).json({ error: err.message });
  }
};