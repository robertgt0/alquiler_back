import { Request, Response, NextFunction } from "express";
import { getProviders } from "../services/providers.service";
import { getProviderById } from "../services/provider.service";
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