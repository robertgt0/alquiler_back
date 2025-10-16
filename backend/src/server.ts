import express, { Request, Response } from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const API_KEY = process.env.API_KEY;

// Configurar transporte con Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Endpoint para recibir el paquete de datos
app.post("/api/notify", async (req: Request, res: Response) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { type, recipient, data } = req.body;

  if (!recipient?.email) {
    return res.status(400).json({ error: "Email del destinatario requerido" });
  }

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: recipient.email,
    subject: `Nueva notificación: ${type}`,
    text: `Hola ${recipient.name || ""},\n\n${data.message || "Tienes una nueva notificación"}.\n\nSaludos,\nEquipo de Plataforma de Servicios`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[INFO] Notificación enviada a ${recipient.email}`);
    return res.json({ status: "ok", message: "Notificación enviada" });
  } catch (error) {
    console.error("[ERROR] Error al enviar correo:", error);
    return res.status(500).json({ error: "Error al enviar correo" });
  }
});

app.listen(PORT, () => {
  console.log(`[INFO] Servidor corriendo en http://localhost:${PORT}`);
});
