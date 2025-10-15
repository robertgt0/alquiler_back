import { Request, Response, NextFunction } from 'express';
import { getAvailabilityService } from '../services/availabilily.service';

export const getProviderAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { providerId } = req.params;
    const { date } = req.query;
    const selectedDate = typeof date === 'string' ? date : undefined;

    // 1. VALIDACIÓN OBLIGATORIA (Corrige el error de tipado y el error 400)
    if (typeof date !== 'string' || !date) {
        return res.status(400).json({ 
            success: false, 
            message: "El parámetro de consulta 'date' (YYYY-MM-DD) es obligatorio." 
        });
    }

    // 2. Llama al Service, que ahora solo recibe un string (el tipo es correcto)
    // El error de tipado desaparece porque 'date' está garantizado como string.
    const data = await getAvailabilityService(providerId, date); 
    // 💡 SOLUCIÓN DEL BLOQUEO DE RESPUESTA: ¡AÑADIR ESTA LÍNEA!
    res.json({ success: true, data }); 
  } catch (err) {
    next(err);
  }
};

