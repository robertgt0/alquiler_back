import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import Ubicacion from './models/Ubicacion';
import Fixer from './models/Fixer';
import { ubicacionesDefinidas } from './data/ubicacionesData';
import { fixersDefinidos } from './data/fixersData';
import mongoose from 'mongoose';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// CONEXIÓN REAL A MONGODB
connectDB();

app.use(cors());
app.use(express.json());

// Health check (EXISTENTE - NO TOCAR)
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    const dbState = mongoose.connection.readyState;
    const isConnected = dbState === 1;
    
    res.json({
      status: 'healthy',
      database: isConnected ? 'connected' : 'disconnected',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy', 
      database: 'error',
      error: 'Error checking database'
    });
  }
});

// GET ubicaciones (EXISTENTE - NO TOCAR)
app.get('/api/ubicaciones', async (req: Request, res: Response) => {
  try {
    const ubicaciones = await Ubicacion.find().sort({ nombre: 1 });
    
    console.log(`📊 Ubicaciones encontradas en MongoDB: ${ubicaciones.length}`);
    
    res.json({
      success: true,
      data: ubicaciones,
      count: ubicaciones.length,
      source: 'mongodb'
    });
  } catch (error) {
    console.error('Error al obtener ubicaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error de base de datos'
    });
  }
});

// CARGAR ubicaciones (EXISTENTE - NO TOCAR)
app.post('/api/ubicaciones/cargar-definidas', async (req: Request, res: Response) => {
  try {
    console.log('🔄 Cargando datos a MongoDB...');
    
    const deleteResult = await Ubicacion.deleteMany({});
    console.log(`🗑️ Eliminados: ${deleteResult.deletedCount} documentos`);
    
    const insertResult = await Ubicacion.insertMany(ubicacionesDefinidas);
    console.log(`✅ Insertados: ${insertResult.length} documentos`);
    
    const count = await Ubicacion.countDocuments();
    
    res.json({
      success: true,
      message: 'Datos cargados en MongoDB',
      deleted: deleteResult.deletedCount,
      inserted: insertResult.length,
      total: count
    });
    
  } catch (error) {
    console.error('❌ Error cargando datos:', error);
    res.status(500).json({
      success: false,
      message: 'No se pudo conectar a MongoDB'
    });
  }
});

// ✅ NUEVO: GET fixers
// ✅ NUEVO: GET fixers
app.get('/api/fixers', async (req: Request, res: Response) => {
  try {
    const fixers = await Fixer.find().sort({ nombre: 1 });
    
    console.log(`🔧 Fixers encontrados en MongoDB: ${fixers.length}`);
    
    res.json({
      success: true,
      data: fixers,
      count: fixers.length
    });
  } catch (error) {
    console.error('Error al obtener fixers:', error);
    res.status(500).json({
      success: false,
      message: 'Error de base de datos'
    });
  }
});

// ✅ NUEVO: CARGAR fixers
app.post('/api/fixers/cargar-definidos', async (req: Request, res: Response) => {
  try {
    console.log('🔄 Cargando fixers en MongoDB...');
    
    const deleteResult = await Fixer.deleteMany({});
    console.log(`🗑️ Eliminados: ${deleteResult.deletedCount} fixers`);
    
    const insertResult = await Fixer.insertMany(fixersDefinidos);
    console.log(`✅ Insertados: ${insertResult.length} fixers`);
    
    const count = await Fixer.countDocuments();
    
    res.json({
      success: true,
      message: 'Fixers cargados en MongoDB',
      deleted: deleteResult.deletedCount,
      inserted: insertResult.length,
      total: count
    });
    
  } catch (error) {
    console.error('❌ Error cargando fixers:', error);
    res.status(500).json({
      success: false,
      message: 'No se pudieron cargar los fixers'
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor listo en http://localhost:${PORT}`);
  console.log(`\n📍 ENDPOINTS DISPONIBLES:`);
  console.log(`   GET  http://localhost:${PORT}/api/ubicaciones`);
  console.log(`   POST http://localhost:${PORT}/api/ubicaciones/cargar-definidas`);
  console.log(`   GET  http://localhost:${PORT}/api/fixers`);
  console.log(`   POST http://localhost:${PORT}/api/fixers/cargar-definidos`);
});