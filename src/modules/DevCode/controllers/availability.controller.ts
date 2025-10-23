import { Request, Response, NextFunction } from 'express';
import { getAvailabilityService } from '../services/availability.service';

export const getProviderAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { providerId } = req.params;
    const { date } = req.query;
    const selectedDate = typeof date === 'string' ? date : undefined;

    const data = await getAvailabilityService(providerId, selectedDate);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

