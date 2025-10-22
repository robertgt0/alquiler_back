// src/index.ts
import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectMongo } from './config/mongoose';
import offersRouter from './routes/offers';
import nombreGrupoEjemploRouter from './modules/nombre_grupo_ejemplo';
import fixerModule from './modules/fixer';
import categoriesModule from './modules/categories';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const origins = (process.env.CORS_ORIGIN ?? '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: origins.length ? origins : true,
  credentials: true
}));

app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'API Backend',
    status: 'OK',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    modules: [
      '/api/offers',
      '/api/nombre_grupo_ejemplo',
      '/api/fixer',
      '/api/categories'
    ]
  });
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.get('/api/health', (_req: Request, res: Response) => {
  const dbEnabled = (process.env.DB_ENABLED ?? 'true').toLowerCase() !== 'false';
  const hasUri = Boolean(process.env.MONGODB_URI ?? process.env.MONGO_URI);

  res.json({
    status: 'healthy',
    database: dbEnabled ? (hasUri ? 'enabled' : 'missing-uri') : 'disabled',
    uptime: process.uptime()
  });
});

app.use('/api/offers', offersRouter);
app.use('/api/nombre_grupo_ejemplo', nombreGrupoEjemploRouter);
app.use('/api/fixer', fixerModule);
app.use('/api/categories', categoriesModule);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.path
  });
});

const PORT = Number(process.env.PORT ?? 4000);
const dbEnabled = (process.env.DB_ENABLED ?? 'true').toLowerCase() !== 'false';
const mongoUri = process.env.MONGODB_URI ?? process.env.MONGO_URI ?? '';

async function bootstrap() {
  if (dbEnabled) {
    if (!mongoUri) {
      console.error('❌ Falta MONGODB_URI (o MONGO_URI) en variables de entorno');
      process.exit(1);
    }

    if (!process.env.MONGODB_URI && process.env.MONGO_URI) {
      process.env.MONGODB_URI = process.env.MONGO_URI;
    }

    try {
      await connectMongo();
    } catch (error) {
      console.error('❌ Error al iniciar el servidor');
      console.error(error);
      process.exit(1);
    }
  } else {
    console.log('🔌 Base de datos desactivada (modo sin DB)');
  }

  app.listen(PORT, () => {
    console.log(`🚀 API listening on port ${PORT}`);
    console.log('📦 Módulos disponibles: /api/offers, /api/nombre_grupo_ejemplo, /api/fixer, /api/categories');
    console.log(`🔌 Base de datos: ${dbEnabled ? 'ACTIVADA' : 'DESACTIVADA'}`);
  });
}

bootstrap();