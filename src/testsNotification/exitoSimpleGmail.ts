// src/testsNotification/exitoSimple.ts
import dotenv from "dotenv";
dotenv.config();

const test = async () => {
  console.log("🚀 Enviando evento de prueba a tu backend...");

  try {
    const res = await fetch("http://localhost:5000/api/gmail-notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY ?? "", // <-- aquí se envía la API key
      },
      body: JSON.stringify({
        subject: "🔔 Prueba simple desde código",
        message: "hola mundito",
        destinations: [{ email: "adrianvallejosflores24@gmail.com", name: "Adrian" }],
        fromName: "Prueba Interna"
      }),
    });

    const json = await res.json();
    console.log("✅ Respuesta del servidor:", json);
  } catch (err) {
    console.error("❌ Error al enviar la prueba:", err);
  }
};

test();
