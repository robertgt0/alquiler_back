// ============================================
// 🧱 Importación de dependencias principales
// ============================================
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
<<<<<<< HEAD
import connectDB from './config/database';
import nombreGrupoEjemploRouter from './modules/nombre_grupo_ejemplo';
import availabilityRoutes from "./modules/DevCode/routes/availability.routes";
// Cargar variables de entorno
=======

// ============================================
// 🧱 Conexión a la base de datos
// ============================================
import connectDB from './config/database';
import mongoose from 'mongoose';

// ============================================
// 🧱 Importación de rutas
// ============================================
import paginationRouter from './modules/borbotones/routes/pagination.router';
import ordenamientoRouter from './modules/borbotones/routes/ordering.routes';
import busquedaRouter from './modules/borbotones/routes/busqueda.router';
import filtrosRouter from './modules/borbotones/routes/filtros.routes';
import busquedaAvanzadaRouter from './modules/borbotones/routes/busquedaAvanzada.router';


// ============================================
// 🔹 Cargar variables de entorno
// ============================================
>>>>>>> dev/los_borbotones-andy-back-felipe
dotenv.config();

// ============================================
// 🔹 Crear aplicación Express
// ============================================
const app = express();

// ============================================
// 🔹 Conectar a la base de datos MongoDB
// ============================================
connectDB();

// ============================================
// 🔹 Middlewares globales
// ============================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// 🔹 Ruta raíz de prueba
// ============================================
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'API Backend',
    status: 'OK',
    version: '1.0.0',
    modules: ['/api/borbotones', '/api/busqueda'],
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// 🧩 Rutas principales
// ============================================

// Historia de usuario P01: paginación
app.use('/api/borbotones', paginationRouter);

// Historia de usuario O01: ordenamiento
app.use('/api/borbotones', ordenamientoRouter);

// Módulo de búsqueda
app.use('/api/borbotones/search', busquedaRouter);


app.use('/api/borbotones/filtros', filtrosRouter);

// Rutas de búsqueda avanzada
app.use("/api/borbotones/search/avanzada", busquedaAvanzadaRouter);

// ============================================
// 🩺 Endpoint de salud (para monitoreo)
// ============================================
app.get('/api/health', (_req: Request, res: Response) => {
  const state = mongoose.connection.readyState; // 0 disconnected, 1 connected, 2 connecting, 3 disconnecting
  const stateMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.json({
    status: state === 1 ? 'healthy' : 'degraded',
    database: stateMap[state] || 'unknown',
    uptime: process.uptime(),
  });
});

// ============================================
<<<<<<< HEAD
// MONTAR MÓDULOS/GRUPOS AQUÍ
// ============================================
// Montar tus módulos aquí:
app.use('/api/nombre_grupo_ejemplo', nombreGrupoEjemploRouter);
app.use('/api/devcode', availabilityRoutes)
// ============================================
// Manejo de errores 404
=======
// ⚠️ Middleware para rutas no encontradas
>>>>>>> dev/los_borbotones-andy-back-felipe
// ============================================
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.path,
  });
});

// ============================================
// 🚀 Inicialización del servidor
// ============================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`⚙️  Modo: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

