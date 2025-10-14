import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import nombreGrupoEjemploRouter from './modules/nombre_grupo_ejemplo';
import trabajosVengadoresRouter from './modules/los_vengadores_trabajos/routes/trabajo.routes';
import losvengadores from './modules/los_vengadores_trabajos';
// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();

// Conectar a MongoDB
//connectDB(); esta linea es la conectara a la bd del proyecto

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta raíz
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: ' API Backend',
    status: 'OK',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    modules: []
  });
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    database: 'connected',
    uptime: process.uptime()
  });
});

// ============================================
// MONTAR MÓDULOS/GRUPOS AQUÍ
// ============================================
// Montar tus módulos aquí:
app.use('/api/nombre_grupo_ejemplo', nombreGrupoEjemploRouter);
app.use('/api/vengadores/trabajos', trabajosVengadoresRouter); //este el modulo de hu 1.7 y 1.8
app.use('/api/los_vengadores', losvengadores);
// ============================================
// Manejo de errores 404
// ============================================
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    success: false,
    message: 'Ruta no encontrada',
    path: req.path
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n Servidor corriendo en puerto ${PORT}`);
  console.log(` Modo: ${process.env.NODE_ENV}`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(`\n Módulos cargados:`);
  console.log(`   - /api/nombre_grupo_ejemplo`);
  console.log(`\n Listo para recibir peticiones!\n`

  );
});