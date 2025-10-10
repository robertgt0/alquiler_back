import { Request, Response } from 'express';

// Intentar diferentes formas de importar la conexión
let testConnection;

try {
  // Opción 1: Si el archivo se llama connection.ts
  const connectionModule = require('../config/connections/connection');
  testConnection = connectionModule.testConnection;
} catch (error) {
  try {
    // Opción 2: Si el archivo se llama conecction.ts
    const connectionModule = require('../config/connections/conecction');
    testConnection = connectionModule.testConnection;
  } catch (error) {
    try {
      // Opción 3: Si el archivo tiene otro nombre
      const connectionModule = require('../config/connections/index');
      testConnection = connectionModule.testConnection;
    } catch (error) {
      console.error('No se pudo cargar el módulo de conexión:', error);
    }
  }
}

// Si no se encuentra la conexión, crear una por defecto
if (!testConnection) {
  console.log('Usando conexión por defecto');
  const { MongoClient } = require('mongodb');

  testConnection = async () => {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://isindira:j5z3oE8XJx4kQb8V@isindira.nqvltjf.mongodb.net/isindira';
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Conectado a MongoDB con conexión por defecto');
    return client;
  };
}

export const getUsuariosPaginados = async (req: Request, res: Response) => {
  let client;
  try {
    // Verificar que la conexión esté disponible
    if (!testConnection) {
      return res.status(500).json({
        success: false,
        message: 'Módulo de conexión no disponible'
      });
    }

    client = await testConnection();
    const db = client.db();
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
    console.error('Error en getUsuariosPaginados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
};

