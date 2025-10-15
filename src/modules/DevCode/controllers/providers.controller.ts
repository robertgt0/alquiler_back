import { Request, Response, NextFunction } from "express";
import { getProviders } from "../services/providers.service";
import { getProviderById } from "../services/provider.service";
import {getBusySlotsForProvider,getAvailableSlotsForProvider,} from "../services/provider.service";

export const getProveedores = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await getProviders();
    res.json(data);
  } catch (err) {
    next(err);
  }
};
export const getProveedor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { providerId } = req.params;
    const data = await getProviderById(providerId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// GET /api/providers/:providerId/busy-slots?date=YYYY-MM-DD
export const getProviderBusySlots = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { providerId } = req.params;
    const { date } = req.query;

    if (!date) return res.status(400).json({ message: "Falta query param 'date' (YYYY-MM-DD)" });

    const busy = await getBusySlotsForProvider(providerId, String(date));
    // Normalizamos nombres para front (opcional)
    const normalized = busy.map(b => ({ start: b.horaInicio, end: b.horaFin }));
    res.json(normalized);
  } catch (err) {
    next(err);
  }
};

// GET /api/providers/:providerId/available-slots?date=YYYY-MM-DD&slot=30&hours=08:00-12:00,14:00-18:00
export const getProviderAvailableSlots = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { providerId } = req.params;
    const { date, slot, hours } = req.query;

    if (!date) return res.status(400).json({ message: "Falta query param 'date' (YYYY-MM-DD)" });

    const slotMinutes = Number(slot) || 30;
    const { available, busy } = await getAvailableSlotsForProvider(
      providerId,
      String(date),
      slotMinutes,               // tu service ya acepta este param
      String(hours || "")        // si pasas horas desde el front
    );

    res.json({
      providerId,
      date,
      slotMinutes,
      busy,          // [{start, end}]
      available,     // [{start, end}]
    });
  } catch (err) {
    next(err);
  }
};