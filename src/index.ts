import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import availabilityRoutes from './modules/DevCode/routes/availability.routes';
import overlapRoutes from './modules/DevCode/routes/overlap.routes';
import authRoutes from './modules/Auth/routes/auth.routes';
import providerRoutes from './modules/Auth/routes/provider.routes';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================
// Middlewares globales
// ==========================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging simple (opcional)
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ==========================
// Rutas raíz / health check
// ==========================
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'API Backend',
    status: 'OK',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    modules: [],
  });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    database: 'connected',
    uptime: process.uptime(),
  });
});

// ==========================
// Montaje de módulos
// ==========================
app.use('/api/devcode/availability', availabilityRoutes);
app.use('/api/devcode/overlap', overlapRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/auth', providerRoutes);

// ==========================
// Middleware 404
// ==========================
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: _req.path,
  });
});

// ==========================
// Middleware global de errores
// ==========================
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
  });
});

// ==========================
// Función para iniciar servidor
// ==========================
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`\n✅ Servidor corriendo en puerto ${PORT}`);
      console.log(`Modo: ${process.env.NODE_ENV || 'development'}`);
      console.log(`URL: http://localhost:${PORT}`);
      console.log('\nListo para recibir peticiones!\n');
    });
  } catch (err) {
    console.error('❌ Error iniciando servidor:', err);
    process.exit(1);
  }
};

startServer();
