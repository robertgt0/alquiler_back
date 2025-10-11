import { Request, Response } from 'express';
import { GeolocationService } from '../services/geolocationService';
import Fixer from '../models/Fixer';
import Ubicacion from '../models/Ubicacion';

export const getNearbyFixers = async (req: Request, res: Response) => {
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
      parseFloat(radius as string)
    );

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
};

export const getNearbyUbicaciones = async (req: Request, res: Response) => {
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
      parseFloat(radius as string)
    );

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
};