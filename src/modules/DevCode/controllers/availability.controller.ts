import { Request, Response, NextFunction } from "express";
import { getAvailabilityService } from "../services/availabilily.service"

export const getProviderAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { providerId } = req.params;
    const data = await getAvailabilityService(providerId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
