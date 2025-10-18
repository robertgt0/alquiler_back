<<<<<<< HEAD
import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectMongo } from './config/mongoose';
import offersRouter from './routes/offers';
import nombreGrupoEjemploRouter from './modules/nombre_grupo_ejemplo';
import fixerModule from './modules/fixer';
import categoriesModule from './modules/categories';
import ofertasModule from './modules/ofertas/routes/ofertas.routes';
=======
import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { connectDB } from './config/mongoose';
import offersRouter from './routes/offers';

async function bootstrap() {
  await connectDB();

  const app = express();
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ ok: true }));
>>>>>>> c2c1a4b (feat(HU9,HU10): API de ofertas (listado y detalle) + Mongo + seed; CORS y env configurados HU9 Y HU10 back terminado)

  // HU9/HU10: módulo de ofertas
  app.use('/api/offers', offersRouter);

<<<<<<< HEAD
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const corsOrigins = [
  ...(process.env.ALLOWED_ORIGINS ?? '').split(','),
  ...(process.env.CORS_ORIGIN ?? '').split(',')
]
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: corsOrigins.length ? corsOrigins : true,
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
      '/api/ofertas',
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
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.use('/api/offers', offersRouter);
app.use('/api/ofertas', ofertasModule);
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
const mongoUri = process.env.MONGODB_URI ?? process.env.MONGO_URI;

async function bootstrap() {
  if (dbEnabled && mongoUri) {
    try {
      await connectMongo();
    } catch (error) {
      console.error('❌ Error al conectar con MongoDB:', error);
      process.exit(1);
    }
  } else if (dbEnabled) {
    console.warn('⚠️ DB_ENABLED=true pero falta MONGODB_URI. No se conectará a Mongo.');
  } else {
    console.log('🔌 Base de datos desactivada (modo sin DB)');
  }

  app.listen(PORT, () => {
    console.log(`🚀 API listening on port ${PORT}`);
    console.log('📦 Módulos disponibles: /api/offers, /api/ofertas, /api/nombre_grupo_ejemplo, /api/fixer, /api/categories');
    console.log(`🔌 Base de datos: ${dbEnabled ? (mongoUri ? 'ACTIVADA' : 'HABILITADA SIN URI') : 'DESACTIVADA'}`);
  });
}

bootstrap();
=======
  app.listen(env.PORT, () => {
    console.log(`🚀 API running on http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});

>>>>>>> c2c1a4b (feat(HU9,HU10): API de ofertas (listado y detalle) + Mongo + seed; CORS y env configurados HU9 Y HU10 back terminado)
