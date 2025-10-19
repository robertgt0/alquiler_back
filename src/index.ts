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

// ============================================
// 🧱 Importación de rutas
// ============================================
import paginationRouter from './modules/borbotones/routes/pagination.router';
import ordenamientoRouter from './modules/borbotones/routes/ordering.routes';
import busquedaRouter from './modules/borbotones/routes/busqueda.router';

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
// Ejemplo: http://localhost:5000/api/busqueda?termino=ele
app.use('/api/busqueda', busquedaRouter);

// ============================================
// 🩺 Endpoint de salud (para monitoreo)
// ============================================
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    database: 'connected',
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
});

export default app;

