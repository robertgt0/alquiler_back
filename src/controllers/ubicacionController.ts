import { Request, Response } from 'express';
import Ubicacion from '../models/Ubicacion';

export const obtenerUbicaciones = async (req: Request, res: Response): Promise<void> => {
  try {
    const ubicaciones = await Ubicacion.find().sort({ nombre: 1 });
    res.status(200).json({
      success: true,
      data: ubicaciones,
      count: ubicaciones.length
    });
  } catch (error) {
    console.error('Error al obtener ubicaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener ubicaciones'
    });
  }
};

export const crearUbicacion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, posicion, direccion, tipo } = req.body;
    
    // Validación básica
    if (!nombre || !posicion || !posicion.lat || !posicion.lng) {
      res.status(400).json({
        success: false,
        message: 'Nombre y posición (lat, lng) son requeridos'
      });
      return;
    }
    
    const nuevaUbicacion = new Ubicacion({
      nombre,
      posicion,
      direccion: direccion || '',
      tipo: tipo || 'punto-interes'
    });
    
    await nuevaUbicacion.save();
    
    res.status(201).json({
      success: true,
      message: 'Ubicación creada exitosamente',
      data: nuevaUbicacion
    });
  } catch (error) {
    console.error('Error al crear ubicación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear ubicación'
    });
  }
};