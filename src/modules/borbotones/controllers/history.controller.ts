import { Request, Response } from 'express';
import { getDatabase } from '../config/conecction';
import { handleError } from '../errors/errorHandler';

/**
 * 📜 MOSTRAR HISTORIAL DE BÚSQUEDAS
 */
export const getSearchHistory = async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    if (!db) {
      return res.status(500).json({
        success: false,
        message: 'Error de conexión con la base de datos.'
      });
    }

    const historial = db.collection('historial');

    const datos = await historial
      .aggregate([
        { $sort: { fecha: -1 } },
        { $group: { _id: '$termino', ultimaFecha: { $first: '$fecha' } } },
        { $sort: { ultimaFecha: -1 } },
        { $limit: 5 }
      ])
      .toArray();

    if (datos.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'Aún no hay búsquedas guardadas en el historial.'
      });
    }

    const ultimas = datos.map(item => item._id);

    return res.status(200).json({
      success: true,
      data: ultimas
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * 🗑️ ELIMINAR HISTORIAL COMPLETO
 */
export const clearSearchHistory = async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    if (!db) {
      return res.status(500).json({
        success: false,
        message: 'Error de conexión con la base de datos.'
      });
    }

    const historial = db.collection('historial');
    const resultado = await historial.deleteMany({});

    if (resultado.deletedCount === 0) {
      return res.status(200).json({
        success: true,
        message: 'El historial ya estaba vacío.'
      });
    }

    return res.status(200).json({
      success: true,
      message: `Historial eliminado correctamente (${resultado.deletedCount} registros borrados).`
    });
  } catch (error) {
    handleError(error, res);
  }
};
