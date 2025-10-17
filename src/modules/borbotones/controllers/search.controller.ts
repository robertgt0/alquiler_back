import { Request, Response } from 'express';
import { getDatabase } from '../config/conecction';
import { handleError } from '../errors/errorHandler';

/**
 * 🔍 AUTOCOMPLETADO CONTEXTUAL
 */
export const searchAutocomplete = async (req: Request, res: Response) => {
  try {
    const { q: searchTerm, limit = 4 } = req.query;

    if (!searchTerm || typeof searchTerm !== 'string') {
      return res.json({ success: true, data: [] });
    }

    if (searchTerm.length > 80) {
      return res.status(400).json({
        success: false,
        message: 'La búsqueda no puede exceder 80 caracteres.'
      });
    }

    const trimmedSearch = searchTerm.trim();
    if (!trimmedSearch || trimmedSearch.length < 2) {
      return res.json({ success: true, data: [] });
    }

    const validCharsRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ´'" ,\s\-]+$/;
    if (!validCharsRegex.test(trimmedSearch)) {
      return res.status(400).json({
        success: false,
        message:
          'Solo se permiten caracteres alfabéticos y los especiales: ´ , - , comilla simple (‘) y comilla doble (“”).'
      });
    }

    const normalizedSearch = trimmedSearch
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[´,'"“”‘’,\-]/g, '')
      .replace(/\s+/g, ' ');

    const db = await getDatabase();
    if (!db) {
      return res.status(500).json({
        success: false,
        message: 'Error de conexión con la base de datos.'
      });
    }

    const especialidades = db.collection('especialidades');
    const historial = db.collection('historial');

    const resultados = await especialidades
      .aggregate([
        {
          $addFields: {
            nombre_normalizado: {
              $toLower: {
                $replaceAll: {
                  input: '$nombre',
                  find: 'á',
                  replacement: 'a'
                }
              }
            }
          }
        },
        {
          $match: {
            nombre_normalizado: { $regex: normalizedSearch, $options: 'i' }
          }
        },
        {
          $project: { id_especialidad: 1, nombre: 1, _id: 0 }
        },
        { $limit: parseInt(limit as string) }
      ])
      .toArray();

    // Guardar historial
    if (trimmedSearch.length >= 2) {
      await historial.updateOne(
        { termino: trimmedSearch.toLowerCase() },
        { $set: { termino: trimmedSearch.toLowerCase(), fecha: new Date() } },
        { upsert: true }
      );
    }

    if (resultados.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: `No se han encontrado resultados para "${trimmedSearch}"`
      });
    }

    const resultadosUnicos = resultados.filter(
      (item, index, self) =>
        index === self.findIndex(e => e.nombre === item.nombre)
    );

    return res.json({
      success: true,
      data: resultadosUnicos,
      searchTerm: trimmedSearch,
      count: resultadosUnicos.length
    });
  } catch (error) {
    handleError(error, res);
  }
};
