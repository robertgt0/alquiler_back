import { Request, Response } from 'express';

// Importación directa y simple del módulo de conexión
import { getDatabase } from '../config/conecction';

export const getUsuariosPaginados = async (req: Request, res: Response) => {
  /*let client: any = null;

  try {
    console.log('🔄 Iniciando consulta de usuarios paginados...');

    // Opción 1: Usar getDatabase (recomendado)
    const db = await getDatabase();
    if (!db) {
      console.error('❌ getDatabase devolvió undefined');
      return res.status(500).json({
        success: false,
        message: 'Error al obtener la conexión a la base de datos'
      });
    }
    const usuariosCollection = db.collection('usuarios');

    // Parámetros de paginación
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Parámetros de filtro opcionales
    const filtros: any = {};

    if (req.query.activo) {
      filtros.activo = req.query.activo === 'true';
    }

    if (req.query.ciudad) {
      filtros['ciudad.nombre'] = { $regex: req.query.ciudad, $options: 'i' };
    }

    if (req.query.especialidad) {
      filtros['especialidades.nombre'] = { $regex: req.query.especialidad, $options: 'i' };
    }

    if (req.query.servicio) {
      filtros['servicios.nombre'] = { $regex: req.query.servicio, $options: 'i' };
    }

    // Parámetros de ordenamiento
    const sortField = (req.query.sortField as string) || 'fecha_registro';
    const sortOrder = (req.query.sortOrder as string) === 'asc' ? 1 : -1;
    const sort: any = { [sortField]: sortOrder };

    console.log('📋 Parámetros de búsqueda:', {
      page,
      limit,
      skip,
      filtros,
      sortField,
      sortOrder
    });

    // Ejecutar consulta con paginación
    const [usuarios, total] = await Promise.all([
      usuariosCollection
        .find(filtros)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray(),

      usuariosCollection.countDocuments(filtros)
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    console.log(`✅ Consulta exitosa: ${usuarios.length} usuarios de ${total} total`);

    res.json({
      success: true,
      data: usuarios,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null
      }
    });

  } catch (error) {
    console.error('❌ Error en getUsuariosPaginados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }*/
  let client: any = null;

  try {
    console.log('🔄 Iniciando consulta de usuarios paginados...');

    // Opción 1: Usar getDatabase (recomendado)
    const db = await getDatabase();
    if (!db) {
      console.error('❌ getDatabase devolvió undefined');
      return res.status(500).json({
        success: false,
        message: 'Error al obtener la conexión a la base de datos'
      });
    }
    const usuariosCollection = db.collection('usuarios');

    // Parámetros de paginación - LIMITE OPCIONAL (default 10)
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Parámetros de filtro opcionales
    const filtros: any = {};

    if (req.query.activo) {
      filtros.activo = req.query.activo === 'true';
    }

    if (req.query.ciudad) {
      filtros['ciudad.nombre'] = { $regex: req.query.ciudad, $options: 'i' };
    }

    if (req.query.especialidad) {
      filtros['especialidades.nombre'] = { $regex: req.query.especialidad, $options: 'i' };
    }

    if (req.query.servicio) {
      filtros['servicios.nombre'] = { $regex: req.query.servicio, $options: 'i' };
    }

    // Parámetros de ordenamiento
    const sortField = (req.query.sortField as string) || 'fecha_registro';
    const sortOrder = (req.query.sortOrder as string) === 'asc' ? 1 : -1;
    const sort: any = { [sortField]: sortOrder };

    console.log('📋 Parámetros de búsqueda:', {
      page,
      limit,
      skip,
      filtros,
      sortField,
      sortOrder
    });

    // Ejecutar consulta con paginación
    const [usuarios, total] = await Promise.all([
      usuariosCollection
        .find(filtros)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray(),

      usuariosCollection.countDocuments(filtros)
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    console.log(`✅ Consulta exitosa: ${usuarios.length} usuarios de ${total} total`);

    res.json({
      success: true,
      data: usuarios,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null
      }
    });

  } catch (error) {
    console.error('❌ Error en getUsuariosPaginados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};


