import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/database';

import Ubicacion from './models/Ubicacion';
import Fixer from './models/Fixer';
import { ubicacionesDefinidas } from './data/ubicacionesData';
import { fixersDefinidos } from './data/fixersData';


import availabilityRoutes from './modules/DevCode/routes/availability.routes';
import userRoutes from './modules/teamsys/index';

// Cargar variables de entorno
dotenv.config();

const app = express();

// 🔐 Confía en el proxy (Render/NGINX) para detectar HTTPS y IPs reales
app.set('trust proxy', 1);

// 🗄️ Conexión a MongoDB (usa MONGODB_URI desde el panel)
connectDB();

// 🌐 CORS: define orígenes permitidos por ENV (coma-separados)
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

// Ej.: CORS_ORIGINS="http://localhost:3000,https://tu-front.vercel.app"
app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true,
  credentials: true,
}));

// 📨 Parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ===============================
// Health check (incluye estado de MongoDB)
// ===============================
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    const dbState = mongoose.connection.readyState; // 0 disconnected, 1 connected, 2 connecting, 3 disconnecting
    const isConnected = dbState === 1;

    res.json({
      status: 'healthy',
      database: isConnected ? 'connected' : 'disconnected',
      dbState,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error health check:', error);
    res.status(500).json({
      status: 'unhealthy',
      database: 'error',
      error: 'Error checking database'
    });
  }
});

// ===============================
// ENDPOINTS: Ubicaciones
// ===============================
// GET ubicaciones
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

// POST cargar ubicaciones definidas
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

// ===============================
// ENDPOINTS: Fixers
// ===============================
// GET fixers
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

// POST cargar fixers definidos
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

// ===============================
// GEOLOCALIZACIÓN - Servicio y endpoints
// ===============================
class GeolocationService {
  // Calcular distancia entre dos puntos (Haversine formula)
  static calculateDistance(loc1: { lat: number; lng: number }, loc2: { lat: number; lng: number }): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.deg2rad(loc2.lat - loc1.lat);
    const dLng = this.deg2rad(loc2.lng - loc1.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(loc1.lat)) * Math.cos(this.deg2rad(loc2.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distancia en km

    return distance;
  }

  // Encontrar fixers cercanos
  static findNearbyFixers(userLocation: { lat: number; lng: number }, fixers: any[], maxDistanceKm: number = 5) {
    return fixers.filter(fixer => {
      const fixerLocation = {
        lat: fixer.posicion?.lat ?? fixer.lat ?? 0,
        lng: fixer.posicion?.lng ?? fixer.lng ?? 0
      };
      const distance = this.calculateDistance(userLocation, fixerLocation);
      return distance <= maxDistanceKm;
    });
  }

  // Encontrar ubicaciones cercanas
  static findNearbyUbicaciones(userLocation: { lat: number; lng: number }, ubicaciones: any[], maxDistanceKm: number = 2) {
    return ubicaciones.filter(ubicacion => {
      const ubicacionLocation = {
        lat: ubicacion.posicion?.lat ?? ubicacion.lat ?? 0,
        lng: ubicacion.posicion?.lng ?? ubicacion.lng ?? 0
      };
      const distance = this.calculateDistance(userLocation, ubicacionLocation);
      return distance <= maxDistanceKm;
    });
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

// GET fixers cercanos
app.get('/api/geolocation/nearby-fixers', async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius = 5 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren coordenadas lat y lng'
      });
    }

    const userLocation = {
      lat: parseFloat(lat as string),
      lng: parseFloat(lng as string)
    };

    // Obtener todos los fixers
    const allFixers = await Fixer.find();

    // Filtrar fixers cercanos
    const nearbyFixers = GeolocationService.findNearbyFixers(
      userLocation,
      allFixers,
      parseFloat(String(radius))
    );

    console.log(`📍 Fixers cercanos encontrados: ${nearbyFixers.length} en radio de ${radius}km`);

    res.json({
      success: true,
      data: nearbyFixers,
      count: nearbyFixers.length,
      userLocation,
      searchRadius: radius
    });

  } catch (error) {
    console.error('Error en geolocalización:', error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar fixers cercanos'
    });
  }
});

// GET ubicaciones cercanas
app.get('/api/geolocation/nearby-ubicaciones', async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius = 2 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren coordenadas lat y lng'
      });
    }

    const userLocation = {
      lat: parseFloat(lat as string),
      lng: parseFloat(lng as string)
    };

    const allUbicaciones = await Ubicacion.find();
    const nearbyUbicaciones = GeolocationService.findNearbyUbicaciones(
      userLocation,
      allUbicaciones,
      parseFloat(String(radius))
    );

    console.log(`📍 Ubicaciones cercanas encontradas: ${nearbyUbicaciones.length} en radio de ${radius}km`);

    res.json({
      success: true,
      data: nearbyUbicaciones,
      count: nearbyUbicaciones.length,
      userLocation,
      searchRadius: radius
    });

  } catch (error) {
    console.error('Error en geolocalización:', error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar ubicaciones cercanas'
    });
  }
});

// ============================================
// MONTAR MÓDULOS/GRUPOS AQUÍ
// ============================================

app.use('/api/devcode', availabilityRoutes);
app.use('/api/teamsys', userRoutes);

// ============================================
// 404 - Ruta no encontrada
// ============================================
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.path,
  });
});

// 🧯 Middleware de errores central
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  if (res.headersSent) return;
  res.status(err?.status || 500).json({ error: err?.message || 'Error interno del servidor' });
});

// 🚀 Start
const PORT = Number(process.env.PORT) || 5000;
const HOST = '0.0.0.0'; // importante en Render
app.listen(PORT, HOST, () => {
  const publicURL = process.env.RENDER_EXTERNAL_URL;
  const localURL = `http://localhost:${PORT}`;
  console.log(`\nServidor corriendo en puerto ${PORT}`);
  console.log(`Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log(`URL: ${publicURL || localURL}`);
  console.log(`\nEndpoints disponibles (ejemplos):`);
  console.log(`   GET  ${localURL}/api/health`);
  console.log(`   GET  ${localURL}/api/ubicaciones`);
  console.log(`   POST ${localURL}/api/ubicaciones/cargar-definidas`);
  console.log(`   GET  ${localURL}/api/fixers`);
  console.log(`   POST ${localURL}/api/fixers/cargar-definidos`);
  console.log(`   GET  ${localURL}/api/geolocation/nearby-fixers?lat=X&lng=Y&radius=5`);
  console.log(`   GET  ${localURL}/api/geolocation/nearby-ubicaciones?lat=X&lng=Y&radius=2`);
  console.log(`\nMódulos montados: /api/nombre_grupo_ejemplo, /api/devcode, /api/teamsys\n`);
});
