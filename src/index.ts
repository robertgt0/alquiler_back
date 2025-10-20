// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import notificationModule from './modules/notifications';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Montar módulo notifications
app.use('/api/notify', notificationModule);

// health
app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

