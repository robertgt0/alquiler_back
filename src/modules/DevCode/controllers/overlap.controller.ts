import { Request, Response, NextFunction } from 'express';
import { isSlotAvailable } from '../services/overlap.service';

export const checkOverlap = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { providerId, date, time } = req.body || {};
        if (!providerId || !date || !time) {
            return res.status(400).json({
                success: false,
                message: 'providerId, date (YYYY-MM-DD) y time (HH:MM) son requeridos',
            });
        }
        const { available } = await isSlotAvailable(String(providerId), String(date), String(time));
        // available=true se puede reservar; available=false -> “No disponible” (solapado/ocupado)
        return res.json({ success: true, data: { available } });
    } catch (err) {
        next(err);
    }
};