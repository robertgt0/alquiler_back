// src/index.ts
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectMongo } from './config/mongoose';
import offersRouter from './routes/offers';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Permite lista separada por comas en CORS_ORIGIN
const origins = (process.env.CORS_ORIGIN ?? '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: origins.length ? origins : true, // true: permitir todos (útil en pruebas)
  credentials: true
}));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/offers', offersRouter);

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
    });
  })
  .catch((e) => {
    console.error('❌ Error al iniciar el servidor');
    console.error(e);
    process.exit(1);
  });
