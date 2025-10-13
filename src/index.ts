// src/index.ts
import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectMongo } from './config/mongoose';
import offersRouter from './routes/offers';
import nombreGrupoEjemploRouter from './modules/nombre_grupo_ejemplo';
import fixerModule from './modules/fixer';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const origins = (process.env.CORS_ORIGIN ?? '')
  .split(',')
  .map(s => s.trim())
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
      '/api/fixer'
    ]
  });
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    database: process.env.MONGODB_URI ? 'configured' : 'missing',
    uptime: process.uptime()
  });
});

app.use('/api/offers', offersRouter);
app.use('/api/nombre_grupo_ejemplo', nombreGrupoEjemploRouter);
app.use('/api/fixer', fixerModule);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.path
  });
});

const PORT = Number(process.env.PORT ?? 4000);
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Falta MONGODB_URI en variables de entorno');
  process.exit(1);
}

connectMongo()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 API listening on port ${PORT}`);
      console.log('📦 Módulos disponibles: /api/offers, /api/nombre_grupo_ejemplo, /api/fixer');
    });
  })
  .catch((e) => {
    console.error('❌ Error al iniciar el servidor');
    console.error(e);
    process.exit(1);
  });
