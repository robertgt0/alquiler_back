import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import connectDB from './config/database';
import offersRouter from './routes/offers';
import fixerModule from './modules/fixer';
import categoriesModule from './modules/categories';
import routesDevcode from './modules/DevCode/routes';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const corsOrigins = [
  ...(process.env.ALLOWED_ORIGINS ?? '').split(','),
  ...(process.env.CORS_ORIGIN ?? '').split(',')
]
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins.length ? corsOrigins : true,
    credentials: true,
  })
);

app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'API Backend',
    status: 'OK',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    modules: ['/api/offers', '/api/fixers', '/api/categories', '/api/devcode'],
  });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.use('/api/offers', offersRouter);
app.use('/api/fixers', fixerModule);
app.use('/api/categories', categoriesModule);
app.use('/api/devcode', routesDevcode);

app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada', path: req.path });
});

const PORT = Number(process.env.PORT ?? 4000);
const dbEnabled = (process.env.DB_ENABLED ?? 'true').toLowerCase() !== 'false';

async function bootstrap() {
  if (dbEnabled) {
    try {
      await connectDB();
      console.log('✅ Base de datos conectada');
    } catch (error) {
      console.error('❌ Error al conectar con MongoDB', error);
      process.exit(1);
    }
  } else {
    console.warn('⚠️ Base de datos desactivada (DB_ENABLED=false)');
  }

  app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
    console.log('Endpoints disponibles: /api/offers, /api/fixers, /api/categories, /api/devcode');
  });
}

bootstrap();

