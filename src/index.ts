
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import nombreGrupoEjemploRouter from './modules/nombre_grupo_ejemplo';
import cardRoutes from "./modules/payments-libelula/routes/cardRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: ' API Backend',
    status: 'OK',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    modules: []
  });
});

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
app.use("/api/payments", cardRoutes);

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
