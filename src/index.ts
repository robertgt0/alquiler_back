import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import connectDB from "./config/database";

// 🔹 Cargar variables de entorno antes de todo
dotenv.config();

// 🔹 Rutas principales de módulos
import notificationRoutes from "./modules/notification/routes/notification.routes";
import notificationsCentralRouter from "./modules/notification/routes/central.router";

// 🔹 Middlewares globales
import { requestLogger } from "./modules/notification/middlewares/request.middleware";
import { notFoundHandler } from "./modules/notification/middlewares/notFound.middleware";
import { globalErrorHandler } from "./modules/notification/middlewares/error.middleware";

// Crear aplicación Express
const app = express();

// ============================================
// CONEXIÓN A LA BASE DE DATOS
// ============================================
connectDB();

// ============================================
// MIDDLEWARES BASE
// ============================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// 🔹 Middleware de logger (antes de las rutas)
app.use(requestLogger);

// ============================================
// RUTAS BÁSICAS
// ============================================
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "API Backend",
    status: "OK",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    modules: ["/api/notifications", "/notifications"],
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
// MÓDULOS
// ============================================
app.use("/notifications", notificationRoutes);
app.use("/api/notifications", notificationsCentralRouter);

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
  console.log(`\n🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🔧 Modo: ${process.env.NODE_ENV}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`\n📦 Módulos cargados:`);
  console.log(`   - /api/notifications`);
  console.log(`   - /notifications`);
  console.log(`\n✅ Listo para recibir peticiones!\n`);
});
