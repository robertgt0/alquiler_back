import { Request, Response } from "express";
import service from "../services/fixers.service"; // en plural
import categoriesService from "../../categories/services/categories.service"; // 👈 nuevo import

// Crear Fixer
export const createFixer = async (req: Request, res: Response) => {
  try {
    const fixer = await service.create(req.body);
    res.status(201).json({ success: true, data: fixer });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// Actualizar Fixer general
export const updateFixer = async (req: Request, res: Response) => {
  try {
    const fixer = await service.update(req.params.id, req.body);
    if (!fixer)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: fixer });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// Obtener Fixer por ID
export const getFixer = async (req: Request, res: Response) => {
  try {
    const fixer = await service.getById(req.params.id);
    if (!fixer)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: fixer });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// ✅ Nuevo controlador: actualizar categorías del Fixer
export const updateFixerCategories = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { categories } = req.body || {};

    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Debe enviar un array de categorías",
      });
    }

    // Validar que existan en el catálogo
    const found = categoriesService.getByIds(categories);
    if (found.length !== categories.length) {
      return res.status(400).json({
        success: false,
        message: "Alguna categoría no existe",
      });
    }

    // Actualizar Fixer
    const updated = await service.update(id, { categories });
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Fixer no encontrado" });
    }

    res.json({
      success: true,
      data: updated,
      message: "Categorías actualizadas correctamente",
    });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
};
