import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectDB } from './modules/dev_los_borbotones/config/conecction';

// 🧩 Importa tu módulo principal
import losBorbotones from './modules/dev_los_borbotones';

const app = express();

// ============================================
// 🔌 Conectar a MongoDB Atlas
// ============================================
(async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB conectado exitosamente');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
  }
})();

// ============================================
// ⚙️ Middlewares globales
// ============================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// 📍 Rutas base
// ============================================
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: '🚀 API Backend de Los Borbotones',
    status: 'OK',
    version: '1.0.0',
    modules: ['/api/borbotones'],
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    database: 'connected',
    uptime: process.uptime(),
  });
});

// ============================================
// 🧱 Montar módulos
// ============================================
// ✅ Este es tu módulo funcional:
app.use('/api/borbotones', losBorbotones);

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
// 🚀 Iniciar servidor
// ============================================
const PORT = process.env.PORT || 5000;
const MODE = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`\n✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`⚙️  Modo: ${MODE}`);
  console.log(`📦 Módulos cargados:`);
  console.log(`   - /api/borbotones`);
  console.log(`\n Listo para recibir peticiones!\n`);
});

export default app;
