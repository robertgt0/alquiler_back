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

  // HU9/HU10: módulo de ofertas
  app.use('/api/offers', offersRouter);

  app.listen(env.PORT, () => {
    console.log(`🚀 API running on http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
