// Importamos las dependencias principales de Express y configuración del servidor
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importamos la función para conectar la base de datos
import connectDB from './config/database';

// Rutas del módulo borbotones
import paginationRouter from './modules/borbotones/routes/pagination.router';
import ordenamientoRouter from './modules/borbotones/routes/ordering.routes';
import busquedaRouter from './modules/borbotones/routes/busqueda.router';

dotenv.config();

export const createApp = () => {
  const app = express();

  // Configuración de CORS con opciones específicas
  app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));

  // Conexión a BD (evitar múltiples conexiones en tests: solo conectar si no existe)
  if (process.env.NODE_ENV !== 'test') {
    connectDB();
  }

  // Middlewares globales
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Ruta raíz
  app.get('/', (req: Request, res: Response) => {
    res.json({
      message: 'API Backend',
      status: 'OK',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      modules: ['/api/busqueda']
    });
  });

  // Montaje de rutas del módulo
  app.use('/api/busqueda', busquedaRouter);
  app.use('/api/borbotones', paginationRouter);
  app.use('/api/borbotones', ordenamientoRouter);

  // 404
  app.use((req: Request, res: Response) => {
    res.status(404).json({ success: false, message: 'Ruta no encontrada', path: req.path });
  });

  return app;
};

// Export por defecto para facilitar importaciones en tests
export default createApp();


