// src/index.ts
import 'dotenv/config';                 // <-- NUEVO
import express from 'express';
import cors from 'cors';
import { connectMongo } from './config/mongoose';
import offersRouter from './routes/offers';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/offers', offersRouter);

connectMongo().then(() => {
  app.listen(Number(process.env.PORT || 4000), () => {
    console.log(`🚀 API running on http://localhost:${process.env.PORT || 4000}`);
  });
}).catch((e) => {
  console.error('❌ Error al iniciar el servidor');
  console.error(e);
});

