// ============================================
// IMPORTS BASE
// ============================================
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import path from "path";

// 🔹 Cargar variables de entorno antes de cualquier import dinámico


dotenv.config({ path: path.resolve(process.cwd(), ".env") });
import routesDevcode from "./modules/DevCode/routes"
// Cargar variables de entorno

// ============================================
// BASE DE DATOS (solo si se usa Gmail o registro de notificaciones)
// ============================================
import connectDB from "./modules/notification_Gmail/config/database";

connectDB().catch((err) => {
  console.error("❌ Error al conectar con la base de datos:", err.message);
});

// ============================================
// MIDDLEWARES GLOBALES
// ============================================
import { requestLogger } from "./modules/notification_Gmail/middlewares/request.middleware";
import { notFoundHandler } from "./modules/notification_Gmail/middlewares/notFound.middleware";
import { globalErrorHandler } from "./modules/notification_Gmail/middlewares/error.middleware";

// ============================================
// IMPORT UTILIDADES INTERNAS (LOCAL LOGGER)
// ============================================
import { logSystem } from "./modules/notification_Gmail/utils/loggerExtended";
import { generateCode } from "./modules/notification_Gmail/utils/helpers";

// ============================================
// RUTAS: GMAIL MODULE
// ============================================
import gmailRoutes from "./modules/notification_Gmail/routes/notification.routes";
import gmailCentralRouter from "./modules/notification_Gmail/routes/central.router";

// ============================================
// RUTAS: WHATSAPP MODULE
// ============================================
import whatsappRoutes from "./modules/notification_WhatsApp/routes/notification.routes";
import whatsappCentralRouter from "./modules/notification_WhatsApp/routes/central.router";

// ============================================
// INICIALIZACIÓN DE APP
// ============================================
const app = express();

// --- Middlewares base ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(requestLogger);



// Ruta raíz
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: "API Backend de Notificaciones",
    status: "OK",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    modules: {
      gmail: ["/api/gmail-notifications", "/gmail-notifications"],
      whatsapp: ["/api/whatsapp-notifications", "/whatsapp-notifications"],
    },
  });
});

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    database: "connected",
    uptime: process.uptime(),
  });
});

// ============================================
// MÓDULOS ACTIVOS
// ============================================

// --- Gmail Notifications ---
app.use("/gmail-notifications", gmailRoutes);
app.use("/api/gmail-notifications", gmailCentralRouter);

// --- WhatsApp Notifications ---
app.use("/whatsapp-notifications", whatsappRoutes);
app.use("/api/whatsapp-notifications", whatsappCentralRouter);


// app.use('/api/nombre_grupo_ejemplo', nombreGrupoEjemploRouter);

// ROUTES DEVCODE
app.use('/api/devcode', routesDevcode)
// ============================================
// MANEJO DE ERRORES
// ============================================
app.use(notFoundHandler);
app.use(globalErrorHandler);

// ============================================
// INICIO DEL SERVIDOR
// ============================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logSystem("INFO", `🚀 Servidor corriendo en puerto ${PORT}`);
  logSystem("INFO", `🔧 Modo: ${process.env.NODE_ENV}`);
  logSystem("INFO", `🌐 URL: http://localhost:${PORT}`);
  logSystem("INFO", `📦 Módulos activos: \n/gmail-notifications, \n/api/gmail-notifications, \n/whatsapp-notifications, \n/api/whatsapp-notifications`);
  logSystem("INFO", "✅ Listo para recibir peticiones!");
});