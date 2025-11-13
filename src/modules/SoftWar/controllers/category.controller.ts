import { Request, Response } from 'express';
import Category from '../../../models/Category.model'; // Importa el modelo

/**
 * Obtiene todas las categorías de la base de datos.
 */
export const getAllCategories = async (_req: Request, res: Response) => {
  try {
    // Busca todas las categorías y las ordena por nombre
    const categories = await Category.find().sort({ name: 'asc' });

    if (categories.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: 'No hay categorías registradas aún',
      });
    }

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

/**
 * Crea una nueva categoría (usado por el seeder o un futuro admin).
 */
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, iconUrl } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'El nombre y la descripción son obligatorios',
      });
    }

    const newCategory = new Category({
      name,
      description,
      iconUrl,
    });

    await newCategory.save();

    res.status(201).json({
      success: true,
      data: newCategory,
      message: 'Categoría creada exitosamente',
    });
  } catch (error: any) {
    // Manejar error de duplicado
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: `La categoría '${req.body.name}' ya existe.`,
      });
    }

    console.error('Error al crear categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};