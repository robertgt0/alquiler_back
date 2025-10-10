import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import Ubicacion from './models/Ubicacion';
import { ubicacionesDefinidas } from './data/ubicacionesData';
import mongoose from 'mongoose';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// CONEXIÓN REAL A MONGODB
connectDB();

app.use(cors());
app.use(express.json());

// Health check SIMPLIFICADO
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    // Verificar conexión simple
    const dbState = mongoose.connection.readyState;
    const isConnected = dbState === 1; // 1 = connected
    
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

// GET ubicaciones - CON DATOS REALES DE MONGODB
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

// CARGAR datos a MongoDB - VERSIÓN CORREGIDA
app.post('/api/ubicaciones/cargar-definidas', async (req: Request, res: Response) => {
  try {
    console.log('🔄 Cargando datos a MongoDB...');
    
    // Limpiar y cargar
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
      message: 'No se pudo conectar a MongoDB',
      solution: 'Configurar IP en MongoDB Atlas: Network Access → Allow access from anywhere'
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor listo en http://localhost:${PORT}`);
  console.log(`\n📍 ACCIÓN REQUERIDA:`);
  console.log(`   1. Ve a: https://cloud.mongodb.com`);
  console.log(`   2. Network Access → Add IP Address → Allow access from anywhere`);
  console.log(`   3. Espera 1-3 minutos`);
  console.log(`   4. Ejecuta: POST http://localhost:${PORT}/api/ubicaciones/cargar-definidas`);
  console.log(`\n✅ MongoDB REAL - CERO datos temporales`);
});