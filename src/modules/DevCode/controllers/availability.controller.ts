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
    
    // 1. VALIDACIÓN OBLIGATORIA 
    if (typeof date !== 'string' || !date) {
        return res.status(400).json({ 
            success: false, 
            message: "El parámetro de consulta 'date' (YYYY-MM-DD) es obligatorio." 
        });
    }

    // 2. Llama al Service, que ahora solo recibe un string (el tipo es correcto)
    const data = await getAvailabilityService(providerId, date); 
    res.json({ success: true, data }); 
  } catch (err) {
    next(err);
  }
};

