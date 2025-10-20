import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

import connectDB from './config/database';
import notificationRoutes from "./modules/notification/routes/notification.routes";
import notificationsCentralRouter from "./modules/notification/routes/central.router";

// Middlewares
import { requestLogger } from "./modules/notification/middlewares/request.middleware";
import { notFoundHandler } from "./modules/notification/middlewares/notFound.middleware";
import { globalErrorHandler } from "./modules/notification/middlewares/error.middleware";

dotenv.config();
import "./config/env";

const app = express();

// Conexión a DB (si es necesario)
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    database: 'connected',
    uptime: process.uptime()
  });
});

// Montar módulos
app.use("/notifications", notificationRoutes);
app.use("/api/notifications", notificationsCentralRouter);

// Middlewares globales
app.use(requestLogger);
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Manejo de rutas no encontradas
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    success: false,
    message: 'Ruta no encontrada',
    path: req.path
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Modo: ${process.env.NODE_ENV}`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`Módulos cargados: /api/notifications`);
});

