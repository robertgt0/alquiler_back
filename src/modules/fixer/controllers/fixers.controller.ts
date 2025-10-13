import { Request, Response } from "express";
import service from "../services/fixers.service"; // en plural


export const createFixer = async (req: Request, res: Response) => {
  try {
    const fixer = await service.create(req.body);
    res.status(201).json({ success: true, data: fixer });
  } catch (e:any) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const updateFixer = async (req: Request, res: Response) => {
  try {
    const fixer = await service.update(req.params.id, req.body);
    if (!fixer) return res.status(404).json({ success:false, message:"Not found" });
    res.json({ success: true, data: fixer });
  } catch (e:any) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const getFixer = async (req: Request, res: Response) => {
  try {
    const fixer = await service.getById(req.params.id);
    if (!fixer) return res.status(404).json({ success:false, message:"Not found" });
    res.json({ success: true, data: fixer });
  } catch (e:any) {
    res.status(400).json({ success: false, message: e.message });
  }
};
