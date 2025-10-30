// ============================================
// 🧱 Importación de dependencias principales
// ============================================
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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
import usersRouter from './modules/borbotones/routes/users.router';


// ============================================
// 🔹 Cargar variables de entorno
// ============================================
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
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
import { loggingMiddleware } from './middlewares/logging.middleware';
app.use(loggingMiddleware);

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Content-Type', 'application/json; charset=utf-8');
    next();
});

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

// Módulo de filtros (debe ir primero para que las rutas específicas tengan prioridad)
app.use('/api/borbotones/filtros', filtrosRouter);

// Historia de usuario P01: paginación
app.use('/api/borbotones', paginationRouter);

// Historia de usuario O01: ordenamiento
app.use('/api/borbotones', ordenamientoRouter);

// Módulo de búsqueda
app.use('/api/borbotones/search', busquedaRouter);

// Módulo de usuarios
app.use('/api/borbotones', usersRouter);

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
// ⚠️ Middleware para rutas no encontradas
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
  
  // Listar todas las rutas montadas
  console.log('\n📍 Rutas principales montadas:');
  console.log('- /api/borbotones/filtros/*');
  console.log('- /api/borbotones/usuarios/*');
  console.log('- /api/borbotones/search/*');
});

export default app;

