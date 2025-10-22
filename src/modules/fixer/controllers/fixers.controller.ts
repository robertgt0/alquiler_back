import { Request, Response } from "express";
import service from "../services/fixers.service";

function onlyDigits(v: string) { return /^\d+$/.test(v); }
function isLengthOK(v: string) { return v.length >= 6 && v.length <= 10; }

export const checkCI = (req: Request, res: Response) => {
  const ci = String(req.query.ci || "").trim();
  const excludeId = req.query.excludeId ? String(req.query.excludeId) : undefined;

  if (!ci) return res.status(400).json({ success: false, message: "El campo C.I. es obligatorio" });
  if (!onlyDigits(ci)) return res.status(400).json({ success: false, message: "C.I. inválido — solo números" });
  if (!isLengthOK(ci)) return res.status(400).json({ success: false, message: "El C.I. no cumple con la longitud permitida" });

  const unique = service.isCIUnique(ci, excludeId);
  if (!unique) return res.json({ success: true, unique: false, message: "Este C.I. ya se encuentra registrado" });
  res.json({ success: true, unique: true, message: "Disponible" });
};

export const createFixer = (req: Request, res: Response) => {
  try {
    const { userId, ci } = req.body || {};
    if (!userId) return res.status(400).json({ success: false, message: "userId requerido" });

    if (ci === undefined || ci === null || String(ci).trim() === "")
      return res.status(400).json({ success: false, message: "El campo C.I. es obligatorio" });

    const ciStr = String(ci).trim();
    if (!onlyDigits(ciStr)) return res.status(400).json({ success: false, message: "C.I. inválido — solo números" });
    if (!isLengthOK(ciStr)) return res.status(400).json({ success: false, message: "El C.I. no cumple con la longitud permitida" });
    if (!service.isCIUnique(ciStr)) return res.status(400).json({ success: false, message: "Este C.I. ya se encuentra registrado" });

    const created = service.create({ userId, ci: ciStr });
    res.status(201).json({ success: true, data: created });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const updateIdentity = (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const ciRaw = req.body?.ci;

    if (ciRaw === undefined || ciRaw === null || String(ciRaw).trim() === "")
      return res.status(400).json({ success: false, message: "El campo C.I. es obligatorio" });

    const ciStr = String(ciRaw).trim();
    if (!onlyDigits(ciStr)) return res.status(400).json({ success: false, message: "C.I. inválido — solo números" });
    if (!isLengthOK(ciStr)) return res.status(400).json({ success: false, message: "El C.I. no cumple con la longitud permitida" });
    if (!service.isCIUnique(ciStr, id)) return res.status(400).json({ success: false, message: "Este C.I. ya se encuentra registrado" });

    const updated = service.update(id, { ci: ciStr });
    if (!updated) return res.status(404).json({ success: false, message: "Fixer no encontrado" });

    res.json({ success: true, data: updated });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const getFixer = (req: Request, res: Response) => {
  try {
    const fixer = service.getById(req.params.id);
    if (!fixer) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: fixer });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
};
