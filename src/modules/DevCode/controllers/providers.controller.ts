import { Request, Response, NextFunction } from "express";
import { getProviders } from "../services/provider.service";
import { getProviderById } from "../services/provider.service";
import { getBusySlotsForProvider } from "../services/provider.service";
import { getAvailableSlotsForProvider } from "../services/provider.service";

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
export async function getProviderBusySlots(req: Request, res: Response, next: NextFunction) {
  try {
    const { providerId } = req.params;
    const { date } = req.query as { date?: string };
    if (!providerId || !date) return res.status(400).json({ message: "providerId (params) y date (query) son requeridos" });
    const slots = await getBusySlotsForProvider(providerId, date);
    res.json(slots);
  } catch (e) { next(e); }
}

export async function getProviderAvailableSlots(req: Request, res: Response, next: NextFunction) {
  try {
    const { providerId } = req.params;
    const { date, slot, hours } = req.query as { date?: string; slot?: string; hours?: string };
    if (!providerId || !date) return res.status(400).json({ message: "providerId (params) y date (query) son requeridos" });
    const slotMinutes = slot ? Number(slot) : 30;
    const out = await getAvailableSlotsForProvider(providerId, date, slotMinutes, hours);
    res.json({ providerId, date, slotMinutes, ...out });
  } catch (e) { next(e); }
}