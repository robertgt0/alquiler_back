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
//import routesDevcode from "./modules/DevCode/routes"
// Cargar variables de entorno

// ============================================
// BASE DE DATOS (solo si se usa Gmail o registro de notificaciones)
// ============================================
import connectDB from "./config/database";

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
// RUTAS: NOTIFICACIONES
// ============================================
import gmailRoutes from "./modules/notification_Gmail/routes/notification.routes";
import gmailCentralRouter from "./modules/notification_Gmail/routes/central.router";
import whatsappRoutes from "./modules/notification_WhatsApp/routes/notification.routes";
import whatsappCentralRouter from "./modules/notification_WhatsApp/routes/central.router";

// ============================================
// RUTAS GENERALES PARA EL PROYECTO - BACKEND
// ============================================
import citaRoutes from "./routes/cita.routes";
import ciudadRoutes from "./routes/ciudad.routes";
import clienteRoutes from "./routes/cliente.routes";
import especialidadRoutes from "./routes/especialidad.routes";
import fixerRoutes from "./routes/fixer.routes";
import historialRoutes from "./routes/historial.routes";
import horarioDisponibleRoutes from "./routes/horario_disponible.routes";
import notificacionGmailRoutes from "./routes/notificacionGmail.routes";
import notificacionWhatsAppRoutes from "./routes/notificacionWhatsApp.routes";
import magiclinkRoutes from "./routes/magiclink.routes";
import provinciaRoutes from "./routes/provincia.routes";
import servicioRoutes from "./routes/servicio.routes";
import sessionRoutes from "./routes/session.routes";
import trabajoRoutes from "./routes/trabajo.routes";
import userRoutes from "./routes/user.routes";
import userAuthRoutes from "./routes/userAuth.routes";
import walletRoutes from "./routes/wallet.routes";


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


// --- Rutas Generales del Proyecto ---
app.use("/api/cita", citaRoutes);
app.use("/api/ciudad", ciudadRoutes);
app.use("/api/cliente", clienteRoutes);
app.use("/api/especialidad", especialidadRoutes);
app.use("/api/fixer", fixerRoutes);
app.use("/api/historial", historialRoutes);
app.use("/api/horario-disponible", horarioDisponibleRoutes);
app.use("/api/notificacion-gmail", notificacionGmailRoutes);
app.use("/api/notificacion-whatsapp", notificacionWhatsAppRoutes);
app.use("/api/magiclink", magiclinkRoutes);
app.use("/api/provincia", provinciaRoutes);
app.use("/api/servicio", servicioRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/trabajo", trabajoRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", userAuthRoutes);
app.use("/api/wallet", walletRoutes);

// app.use('/api/nombre_grupo_ejemplo', nombreGrupoEjemploRouter);

// ROUTES DEVCODE
//app.use('/api/devcode', routesDevcode)
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
  const baseUrl = `http://localhost:${PORT}`;

  const modules = [
    "📩 Gmail Notifications:",
    "   - /gmail-notifications",
    "   - /api/gmail-notifications",
    "",
    "💬 WhatsApp Notifications:",
    "   - /whatsapp-notifications",
    "   - /api/whatsapp-notifications",
    "",
    "🗂️ Rutas Generales del Proyecto:",
    "   - /api/cita",
    "   - /api/ciudad",
    "   - /api/cliente",
    "   - /api/especialidad",
    "   - /api/fixer",
    "   - /api/historial",
    "   - /api/horario-disponible",
    "   - /api/magiclink",
    "   - /api/notificacion-gmail",
    "   - /api/notificacion-whatsapp",
    "   - /api/provincia",
    "   - /api/servicio",
    "   - /api/session",
    "   - /api/trabajo",
    "   - /api/user",
    "   - /api/auth",
    "   - /api/wallet",
  ];

  logSystem("INFO", `🚀 Servidor corriendo en puerto ${PORT}`);
  logSystem("INFO", `🔧 Modo: ${process.env.NODE_ENV}`);
  logSystem("INFO", `🌐 URL base: ${baseUrl}`);
  logSystem("INFO", "📦 Módulos activos:\n" + modules.join("\n"));
  logSystem("INFO", "✅ Listo para recibir peticiones!");
});
