import { Request, Response, NextFunction } from "express";
import { seed } from "../services/provider.service"; 

export const postProvider = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await seed();
    res.json(data);
  } catch (err) {
    next(err);
  }
};
