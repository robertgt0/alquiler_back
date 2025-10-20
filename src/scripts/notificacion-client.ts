/**
 * scripts/notification-client.ts
 * Cliente de prueba para el módulo de notificaciones.
 *
 * Requisitos: npm i axios dotenv
 * Ejecutar: npx ts-node scripts/notification-client.ts
 */

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BASE = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

async function createNotification() {
  const payload = {
    subject: "Prueba demo - módulo notificaciones",
    message: "Mensaje de prueba desde el cliente de demo",
    channel: "email",
    destinations: [
      { email: process.env.TEST_TO_EMAIL || "destinatario@ejemplo.com", name: "Destinatario Demo" }
    ],
    // campos opcionales: type, fromName, transactionId, metadata...
  };

  console.log("POST", `${BASE}/notifications`, payload);
  const resp = await axios.post(`${BASE}/notifications`, payload);
  console.log("-> createNotification response:", resp.status, resp.data);
  return resp.data;
}

async function listNotifications() {
  console.log("GET", `${BASE}/notifications`);
  const resp = await axios.get(`${BASE}/notifications?limit=5&page=1`);
  console.log("-> listNotifications response:", resp.status);
  console.table(resp.data.items || resp.data);
  return resp.data;
}

async function getNotification(id: string) {
  console.log("GET", `${BASE}/notifications/${id}`);
  const resp = await axios.get(`${BASE}/notifications/${id}`);
  console.log("-> getNotification response:", resp.status, resp.data);
  return resp.data;
}

async function centralReceive() {
  const payload = {
    subject: "Prueba desde cliente central",
    message: "Este mensaje prueba /api/notifications (central router)",
    destinations: [{ email: process.env.TEST_TO_EMAIL || "destinatario@ejemplo.com" }],
    fromName: "ServicioCentral"
  };
  console.log("POST", `${BASE}/api/notifications`, payload);
  const resp = await axios.post(`${BASE}/api/notifications`, payload);
  console.log("-> centralReceive response:", resp.status, resp.data);
  return resp.data;
}

async function main() {
  try {
    // 1) Crear una notificación (endpoint del módulo)
    const created = await createNotification();

    // 2) Listar (confirmar que aparece)
    await listNotifications();

    // 3) Obtener por id (si el create devolvió un id)
    // Nota: adapta según la forma en que el servidor devuelve id/transactionId
    const id = created?.notification?._id || created?.id || created?.notification?.id || created?.transactionId;
    if (id) {
      await getNotification(id);
    } else {
      console.warn("No se obtuvo ID desde la creación, omitiendo GET /notifications/:id");
    }

    // 4) Llamada al endpoint central
    await centralReceive();

    console.log("\n--- Demo finalizada ---");
  } catch (err: any) {
    if (err.response) {
      console.error("ERROR HTTP:", err.response.status, err.response.data);
    } else {
      console.error("ERROR:", err.message || err);
    }
    process.exit(1);
  }
}

main();
