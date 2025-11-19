// ============================================
// IMPORTS BASE - COMMONJS
// ============================================
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const path = require("path");

// Módulos locales con require
const ubicacionesRoutes = require("./routes/ubicaciones.routes");
const connectToDB = require("./config/database"); // ✅ Nombre corregido

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// ============================================
// BASE DE DATOS
// ============================================
connectToDB().catch((err: any) => {
  console.error("Error al conectar con la base de datos:", err.message);
});

// ============================================
// MIDDLEWARES GLOBALES - COMMONJS
// ============================================
const { requestLogger } = require("./modules/notification_Gmail/middlewares/request.middleware");
const { notFoundHandler } = require("./modules/notification_Gmail/middlewares/notFound.middleware");
const { globalErrorHandler } = require("./modules/notification_Gmail/middlewares/error.middleware");

// ============================================
// UTILIDADES - COMMONJS
// ============================================
const { logSystem } = require("./modules/notification_Gmail/utils/loggerExtended");

// ============================================
// RUTAS DE NOTIFICACIONES - COMMONJS
// ============================================
const gmailRoutes = require("./modules/notification_Gmail/routes/notification.routes");
const gmailCentralRouter = require("./modules/notification_Gmail/routes/central.router");
const whatsappRoutes = require("./modules/notification_WhatsApp/routes/notification.routes");
const whatsappCentralRouter = require("./modules/notification_WhatsApp/routes/central.router");

// ============================================
// RUTAS GENERALES - COMMONJS
// ============================================
const citaRoutes = require("./routes/cita.routes");
const ciudadRoutes = require("./routes/ciudad.routes");
const clienteRoutes = require("./routes/cliente.routes");
const especialidadRoutes = require("./routes/especialidad.routes");
const fixerRoutes = require("./routes/fixer.routes");
const historialRoutes = require("./routes/historial.routes");
const horarioDisponibleRoutes = require("./routes/horario_disponible.routes");
const notificacionGmailRoutes = require("./routes/notificacionGmail.routes");
const notificacionWhatsAppRoutes = require("./routes/notificacionWhatsApp.routes");
const magiclinkRoutes = require("./routes/magiclink.routes");
const provinciaRoutes = require("./routes/provincia.routes");
const servicioRoutes = require("./routes/servicio.routes");
const sessionRoutes = require("./routes/session.routes");
const trabajoRoutes = require("./routes/trabajo.routes");
const userRoutes = require("./routes/user.routes");
const userAuthRoutes = require("./routes/userAuth.routes");
const walletRoutes = require("./routes/wallet.routes");

// ============================================
// RUTAS DEL EQUIPO - COMMONJS
// ============================================
const offersRouter = require("./routes/offers");
const fixerModule = require("./modules/fixer");
const categoriesModule = require("./modules/categories");
const teamsysModule = require("./modules/teamsys");

// ============================================
// APP SETUP
// ============================================
const app = express();

// 🔐 Confía en el proxy (Render/NGINX) para detectar HTTPS y IPs reales
app.set('trust proxy', 1);

const corsOrigins = [
  ...(process.env.ALLOWED_ORIGINS ?? "").split(","),
  ...(process.env.CORS_ORIGIN ?? "").split(","),
]
  .map((origin: string) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins.length ? corsOrigins : true,
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(helmet());
app.use(requestLogger);

// ============================================
// RUTAS PÚBLICAS
// ============================================
app.get("/", (_req: any, res: any) => {
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
        "/api/ubicaciones"
      ],
      teamScrumPiones: ["/api/offers", "/api/fixers", "/api/categories", "/api/teamsys"],
    },
  });
});

app.get("/api/health", (_req: any, res: any) => {
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
app.use("/api/ubicaciones", ubicacionesRoutes);

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
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  const publicURL = process.env.RENDER_EXTERNAL_URL;
  const localURL = `http://localhost:${PORT}`;
  
  logSystem("INFO", `Servidor corriendo en puerto ${PORT}`);
  logSystem("INFO", `Modo: ${process.env.NODE_ENV || 'development'}`);
  logSystem("INFO", `URL: ${publicURL || localURL}`);
  logSystem("INFO", "Listo para recibir peticiones!");
});