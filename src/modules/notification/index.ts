import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import connectDB from "../../config/database";

// Rutas
import notificationRoutes from "./routes/notification.routes";
import notificationsCentralRouter from "./routes/central.router";

// Middlewares
import { requestLogger } from "./middlewares/request.middleware";
import { notFoundHandler } from "./middlewares/notFound.middleware";
import { globalErrorHandler } from "./middlewares/error.middleware";

// Cargar variables de entorno
dotenv.config();
import "../../config/env";

// Crear aplicación Express
const app = express();

// Conectar a MongoDB si lo deseas
connectDB();

// Middlewares base
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// Logger de requests
app.use(requestLogger);

// Ruta raíz
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "API Backend - Notifications Module",
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
// Rutas del módulo
// ============================================
app.use("/notifications", notificationRoutes);
app.use("/api/notifications", notificationsCentralRouter);

// ============================================
// Middlewares finales de errores
// ============================================
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\nServidor Notifications corriendo en puerto ${PORT}`);
  console.log(`Modo: ${process.env.NODE_ENV}`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`\nMódulos cargados:`);
  console.log(`   - /api/notifications`);
  console.log(`   - /notifications`);
  console.log(`\nListo para recibir peticiones!\n`);
});

