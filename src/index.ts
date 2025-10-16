import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import userRoutes from './modules/teamsys/index';

dotenv.config();

const app = express();

// 🔐 Confía en el proxy (Render/NGINX) para detectar HTTPS y IPs reales
app.set('trust proxy', 1);

// 🗄️ Conexión a MongoDB (usa MONGODB_URI desde el panel de Render)
connectDB();

// 🌐 CORS: define orígenes permitidos por ENV (coma-separados)
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

// Ej.: CORS_ORIGINS="http://localhost:3000,https://tu-front.vercel.app"
app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true,
  credentials: true,
}));

// 📨 Parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 🩺 Health check simple
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
  });
});

// 🌱 Root
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'API Backend',
    status: 'OK',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    modules: ['/api/teamsys'],
  });
});

// 🚏 Módulos
app.use('/api/teamsys', userRoutes);

// 🚫 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.path,
  });
});

// 🧯 (Opcional) Middleware de errores central
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  if (res.headersSent) return;
  res.status(err?.status || 500).json({ error: err?.message || 'Error interno del servidor' });
});

// 🚀 Start
const PORT = Number(process.env.PORT) || 5000;
const HOST = '0.0.0.0'; // importante en Render
app.listen(PORT, HOST, () => {
  // Render expone esta var con la URL pública del servicio
  const publicURL = process.env.RENDER_EXTERNAL_URL;
  const localURL = `http://localhost:${PORT}`;
  console.log(`\n Servidor corriendo en puerto ${PORT}`);
  console.log(` Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log(` URL: ${publicURL || localURL}`);
  console.log(`\n Módulos cargados:`);
  console.log(`   - /api/teamsys`);
  console.log(`\n Listo para recibir peticiones!\n`);
});
