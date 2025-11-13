import { Router } from 'express';
import {
  getAllCategories,
  createCategory,
} from '../controllers/category.controller'; // 👈 Ruta correcta al controller

const router = Router();

// Define las rutas para este módulo
// (Estas rutas se montarán bajo /api/softwar/categories)

// GET /api/softwar/categories
// Obtiene todas las categorías
router.get('/', getAllCategories);

// POST /api/softwar/categories
// Crea una nueva categoría
router.post('/', createCategory);

export default router;