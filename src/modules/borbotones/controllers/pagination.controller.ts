/*import { Request, Response } from 'express';

// Importación directa y simple del módulo de conexión
import { getDatabase } from '../config/conecction';

export const getUsuariosPaginados = async (req: Request, res: Response) => {
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
  }
};
*/
import { Request, Response } from 'express';
import { getDatabase } from '../config/conecction';

export const getUsuariosPaginados = async (req: Request, res: Response) => {
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

    // NUEVOS FILTROS - Zona
    if (req.query.zona) {
      filtros['zona.nombre'] = { $regex: req.query.zona, $options: 'i' };
    }

    // NUEVOS FILTROS - Horario
    if (req.query.horario) {
      filtros['horarios_disponibles.nombre'] = { $regex: req.query.horario, $options: 'i' };
    }

    // NUEVOS FILTROS - Precio (rango de precios)
    if (req.query.precio_min || req.query.precio_max) {
      filtros['servicios.precio'] = {};

      if (req.query.precio_min) {
        filtros['servicios.precio'].$gte = parseInt(req.query.precio_min as string);
      }

      if (req.query.precio_max) {
        filtros['servicios.precio'].$lte = parseInt(req.query.precio_max as string);
      }
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

export const validarPaginaExistente = async (req: Request, res: Response) => {
  try {
    console.log('🔄 Validando existencia de página...');

    const db = await getDatabase();
    if (!db) {
      console.error('❌ getDatabase devolvió undefined');
      return res.status(500).json({
        success: false,
        message: 'Error al obtener la conexión a la base de datos'
      });
    }
    const usuariosCollection = db.collection('usuarios');

    // Parámetros de validación
    const paginaGuardada = parseInt(req.query.paginaGuardada as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Parámetros de filtro opcionales (deben ser los mismos que se usaron originalmente)
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

    if (req.query.zona) {
      filtros['zona.nombre'] = { $regex: req.query.zona, $options: 'i' };
    }

    if (req.query.horario) {
      filtros['horarios_disponibles.nombre'] = { $regex: req.query.horario, $options: 'i' };
    }

    if (req.query.precio_min || req.query.precio_max) {
      filtros['servicios.precio'] = {};

      if (req.query.precio_min) {
        filtros['servicios.precio'].$gte = parseInt(req.query.precio_min as string);
      }

      if (req.query.precio_max) {
        filtros['servicios.precio'].$lte = parseInt(req.query.precio_max as string);
      }
    }

    console.log('📋 Validando página:', {
      paginaGuardada,
      limit,
      filtros
    });

    // Obtener el total actual de documentos con los mismos filtros
    const total = await usuariosCollection.countDocuments(filtros);
    const totalPages = Math.ceil(total / limit);

    // Validar si la página guardada existe en el nuevo total
    const paginaExiste = paginaGuardada <= totalPages && paginaGuardada > 0;
    const paginaAjustada = paginaExiste ? paginaGuardada : 1;

    console.log(`✅ Validación completada: Página ${paginaGuardada} ${paginaExiste ? 'existe' : 'no existe'}`);

    res.json({
      success: true,
      data: {
        paginaGuardada,
        paginaExiste,
        paginaAjustada,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        necesitaAjuste: !paginaExiste
      }
    });

  } catch (error) {
    console.error('❌ Error en validarPaginaExistente:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al validar página',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};
