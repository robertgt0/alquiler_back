// src/testsNotification/exitoSimpleWhatsApp.ts
import dotenv from "dotenv";
dotenv.config();

const test = async () => {
  console.log("📱 Enviando mensaje de prueba por WhatsApp...");

  try {
    const res = await fetch("http://localhost:5000/api/whatsapp-notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY ?? "", // Protege tu endpoint igual que el de Gmail
      },
      body: JSON.stringify({
        message: "🚀 Hola, este es un mensaje de prueba enviado desde el backend vía Evolution API.",
        destinations: [
          {
            phone: process.env.TEST_PHONE || "59177484270", // número con código de país
            name: "Usuario de prueba",
          },
        ],
        fromName: "Backend Test WhatsApp",
      }),
    });

    const json = await res.json();
    console.log("✅ Respuesta del servidor:", json);
  } catch (err) {
    console.error("❌ Error al enviar la prueba:", err);
  }
};

test();
