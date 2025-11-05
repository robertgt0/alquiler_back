/*




import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import connectDB from "./config/database";
import notificationRoutes from "./modules/notification/routes/notification.routes";
import notificationsCentralRouter from "./modules/notification/routes/central.router";

// ⬇️ MIDDLEWARES (RUTA EN SINGULAR)
import { requestLogger } from "./modules/notification/middlewares/request.middleware";
import { notFoundHandler } from "./modules/notification/middlewares/notFound.middleware";
import { globalErrorHandler } from "./modules/notification/middlewares/error.middleware";

// Cargar variables de entorno
dotenv.config();
import "./config/env";

// Crear aplicación Express
const app = express();

// Conectar a MongoDB si lo deseas
// connectDB();

// Middlewares base
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// 🧩 Logger por request (antes de las rutas)
app.use(requestLogger);


//Ruta raiz 1

app.get("/", (req: Request, res: Response) => {
    res.json({
        message: " API Backend",
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
// ERRORES (DESPUÉS DE LAS RUTAS)
// ============================================
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n Servidor corriendo en puerto ${PORT}`);
    console.log(` Modo: ${process.env.NODE_ENV}`);
    console.log(` URL: http://localhost:${PORT}`);
    console.log(`\n Módulos cargados:`);
    console.log(`   - /api/notifications`);
    console.log(`   - /notifications`);
    console.log(`\n Listo para recibir peticiones!\n`);
});





*/
