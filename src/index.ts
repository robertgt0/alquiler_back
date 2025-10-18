import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import notificationRoutes from "./modules/notification/routes/notification.routes";
import notificationsCentralRouter from "./modules/notification/routes/central.router";
import helmet from "helmet";


// Cargar variables de entorno
dotenv.config();
import "./config/env";

// Crear aplicación Express
const app = express();

// Conectar a MongoDB
connectDB();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

/*
Ruta raiz 1: prueben con esta app que esta por defecto, en mi caso en mi
maquina no funciono y use la otra version de abajo, solo para constatar
pueden verificarlo, atte:Adrian
*/
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: ' API Backend',
    status: 'OK',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    modules: []
  });
});


/*Ruta raíz 2: Con esto seccion cambiada, al visitar http://localhost:5000 
verás una página HTML con tu mensaje personalizado, no un JSON, atte:Adrian
/*
app.get('/', (req: Request, res: Response) => {
  res.send(`
    <h1>🚀 Backend del sistema de ofertas y contrataciones en ejecución</h1>
    <p>El servidor está funcionando correctamente.</p>
    <p>Versión: 1.0.0</p>
    <p>Entorno: ${process.env.NODE_ENV}</p>
    <p>Tiempo: ${new Date().toLocaleString()}</p>
  `);
});
*/


// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    database: 'connected',
    uptime: process.uptime()
  });
});

// ============================================
// MONTAR MÓDULOS/GRUPOS AQUÍ
// ============================================
// Montar tus módulos aquí:
app.use("/notifications", notificationRoutes);
app.use("/api/notifications", notificationsCentralRouter);

// ============================================
// Manejo de errores 404
// ============================================
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
  console.log(`\n Servidor corriendo en puerto ${PORT}`);
  console.log(` Modo: ${process.env.NODE_ENV}`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(`\n Módulos cargados:`);
  console.log(`   - /api/notifications`);
  console.log(`\n Listo para recibir peticiones!\n`

  );
});