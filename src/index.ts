import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import emailRoutes from './routes/email';
import notificationModule from './modules/notifications';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Ruta principal
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Servidor funcionando correctamente 🚀' });
});

// Montar rutas existentes
app.use('/api', emailRoutes);

// Montar módulo de notifications
app.use('/api/notify', notificationModule);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

