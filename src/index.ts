// ============================================
// IMPORTS BASE
// ============================================
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// ============================================
// BASE DE DATOS
// ============================================
import connectDB from "./config/database";

connectDB().catch((err) => {
  console.error("Error al conectar con la base de datos:", err.message);
});

// ============================================
// MIDDLEWARES GLOBALES
// ============================================
import { requestLogger } from "./modules/notification_Gmail/middlewares/request.middleware";
import { notFoundHandler } from "./modules/notification_Gmail/middlewares/notFound.middleware";
import { globalErrorHandler } from "./modules/notification_Gmail/middlewares/error.middleware";

// ============================================
// UTILIDADES
// ============================================
import { logSystem } from "./modules/notification_Gmail/utils/loggerExtended";

// ============================================
// RUTAS DE NOTIFICACIONES
// ============================================
import gmailRoutes from "./modules/notification_Gmail/routes/notification.routes";
import gmailCentralRouter from "./modules/notification_Gmail/routes/central.router";
import whatsappRoutes from "./modules/notification_WhatsApp/routes/notification.routes";
import whatsappCentralRouter from "./modules/notification_WhatsApp/routes/central.router";

// ============================================
// RUTAS GENERALES
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
// RUTAS DEL EQUIPO (OFERTAS / FIXERS / CATEGORIES / TEAMSYS)
// ============================================
import offersRouter from "./routes/offers";
import fixerModule from "./modules/fixer";
import categoriesModule from "./modules/categories";
import teamsysModule from "./modules/teamsys";

// ============================================
// APP SETUP
// ============================================
const app = express();

const corsOrigins = [
  ...(process.env.ALLOWED_ORIGINS ?? "").split(","),
  ...(process.env.CORS_ORIGIN ?? "").split(","),
]
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins.length ? corsOrigins : true,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(helmet());
app.use(requestLogger);

// ============================================
// RUTAS PÚBLICAS
// ============================================
app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "API Backend Servineo",
    status: "OK",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    modules: {
      notifications: {
        gmail: ["/api/gmail-notifications", "/gmail-notifications"],
        whatsapp: ["/api/whatsapp-notifications", "/whatsapp-notifications"],
      },
      general: [
        "/api/cita",
        "/api/ciudad",
        "/api/cliente",
        "/api/especialidad",
        "/api/fixer",
        "/api/historial",
        "/api/horario-disponible",
        "/api/magiclink",
        "/api/notificacion-gmail",
        "/api/notificacion-whatsapp",
        "/api/provincia",
        "/api/servicio",
        "/api/session",
        "/api/trabajo",
        "/api/user",
        "/api/auth",
        "/api/wallet",
      ],
      teamScrumPiones: ["/api/offers", "/api/fixers", "/api/categories", "/api/teamsys"],
    },
  });
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "healthy",
    database: "connected",
    uptime: process.uptime(),
  });
});

// ============================================
// RUTAS DE MODULOS
// ============================================
app.use("/gmail-notifications", gmailRoutes);
app.use("/api/gmail-notifications", gmailCentralRouter);
app.use("/whatsapp-notifications", whatsappRoutes);
app.use("/api/whatsapp-notifications", whatsappCentralRouter);

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

// Rutas del equipo
app.use("/api/offers", offersRouter);
app.use("/api/fixers", fixerModule);
app.use("/api/categories", categoriesModule);
app.use("/api/teamsys", teamsysModule);

// ============================================
// MANEJO DE ERRORES
// ============================================
app.use(notFoundHandler);
app.use(globalErrorHandler);

// ============================================
// SERVIDOR
// ============================================
const PORT = Number(process.env.PORT ?? 5000);

app.listen(PORT, () => {
  const baseUrl = `http://localhost:${PORT}`;
  logSystem("INFO", `Servidor corriendo en puerto ${PORT}`);
  logSystem("INFO", `Modo: ${process.env.NODE_ENV}`);
  logSystem("INFO", `URL base: ${baseUrl}`);
});
