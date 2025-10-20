import { Request, Response } from 'express';
import { getDatabase } from '../config/conecction';
import { handleError } from '../errors/errorHandler';

export const getSearchHistory = async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    if (!db)
      return res
        .status(500)
        .json({ success: false, message: 'Error de conexión con la base de datos.' });

    const historial = db.collection('historial');

    const datos = await historial
      .aggregate([
        { $sort: { fecha: -1 } },
        { $group: { _id: '$terminoOriginal', ultimaFecha: { $first: '$fecha' } } },
        { $sort: { ultimaFecha: -1 } },
        { $limit: 5 },
      ])
      .toArray();

    if (datos.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'Aún no hay búsquedas registradas.',
      });
    }

    return res.status(200).json({
      success: true,
      data: datos.map((d) => d._id),
    });
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * 🗑️ ELIMINAR TODO EL HISTORIAL
 */
export const clearSearchHistory = async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    if (!db)
      return res
        .status(500)
        .json({ success: false, message: 'Error de conexión con la base de datos.' });

    const historial = db.collection('historial');
    const result = await historial.deleteMany({});

    res.status(200).json({
      success: true,
      message:
        result.deletedCount === 0
          ? 'El historial ya estaba vacío.'
          : `Historial eliminado (${result.deletedCount} registros).`,
    });
  } catch (error) {
    handleError(error, res);
  }
};
