import { Request, Response } from "express";
import { getDatabase } from '../config/conecction';
import { handleError } from '../errors/errorHandler';

const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]]/g, '\\$&');


export const buscarPorServicio = async (req: Request, res: Response) => {
  try {
    const { servicio, ciudad, page = "1", limit = "50" } = req.query;

    if (!servicio || typeof servicio !== 'string' || !servicio.trim()) {
      return res.status(400).json({
        success: false,
        message: "El parámetro 'servicio' es requerido"
      });
    }

    const servicioNombre = servicio.trim();
    const pageSize = Math.min(Number(limit) || 50, 200);
    const currentPage = Math.max(Number(page) || 1, 1);
    const skip = (currentPage - 1) * pageSize;

    const db = await getDatabase();
    if (!db) {
      return res.status(500).json({
        success: false,
        message: "Error de conexión con la base de datos"
      });
    }

    const usuarios = db.collection('usuarios');
    const servicios = db.collection('servicios');


    const serviciosCoincidentes = await servicios.find({
      nombre: new RegExp(escapeRegex(servicioNombre), "i")
    }).toArray();

    if (serviciosCoincidentes.length === 0) {
      return res.json({
        success: true,
        total: 0,
        page: currentPage,
        pageSize: pageSize,
        data: [],
        message: `No se encontraron servicios con el nombre "${servicioNombre}"`
      });
    }


    const idsServicios = serviciosCoincidentes.map(s => s.id_servicio);


    const filters: any[] = [
      {
        "servicios.id_servicio": { $in: idsServicios }
      },
      { activo: true }
    ];


    if (ciudad && typeof ciudad === 'string' && ciudad.trim()) {
      const ciudadRegex = new RegExp(escapeRegex(ciudad.trim()), "i");
      filters.push({ "ciudad.nombre": ciudadRegex });
    }

    const pipeline = [
      { $match: { $and: filters } },
      {
        $addFields: {
          servicios_coincidentes: {
            $filter: {
              input: "$servicios",
              as: "serv",
              cond: {
                $in: ["$$serv.id_servicio", idsServicios]
              }
            }
          }
        }
      },
      { $sort: { nombre: 1 } },
      { $skip: skip },
      { $limit: pageSize },
      {
        $project: {
          _id: 1,
          id_usuario: 1,
          nombre: 1,
          telefono: 1,
          email: 1,
          ciudad: 1,
          servicios_coincidentes: 1,
          especialidades: { $slice: ["$especialidades", 2] }
        }
      }
    ];

    const [resultados, total] = await Promise.all([
      usuarios.aggregate(pipeline).toArray(),
      usuarios.countDocuments({ $and: filters })
    ]);

    res.json({
      success: true,
      total,
      page: currentPage,
      pageSize: pageSize,
      data: resultados,
      servicios_encontrados: serviciosCoincidentes.map(s => ({
        id_servicio: s.id_servicio,
        nombre: s.nombre,
        descripcion: s.descripcion
      }))
    });

  } catch (error: any) {
    console.error("Error en búsqueda por servicio:", error);
    handleError(error, res);
  }
};


export const buscarPorDisponibilidad = async (req: Request, res: Response) => {
  try {
    const { turno, ciudad, page = "1", limit = "50" } = req.query;

    if (!turno || typeof turno !== 'string' || !turno.trim()) {
      return res.status(400).json({
        success: false,
        message: "El parámetro 'turno' es requerido (Mañana, Tarde, Noche, Madrugada)"
      });
    }

    const turnoNombre = turno.trim();
    const pageSize = Math.min(Number(limit) || 50, 200);
    const currentPage = Math.max(Number(page) || 1, 1);
    const skip = (currentPage - 1) * pageSize;

    const db = await getDatabase();
    if (!db) {
      return res.status(500).json({
        success: false,
        message: "Error de conexión con la base de datos"
      });
    }

    const usuarios = db.collection('usuarios');


    const turnosValidos = ["Mañana", "Tarde", "Noche", "Madrugada"];
    const turnoEncontrado = turnosValidos.find(t =>
      t.toLowerCase().includes(turnoNombre.toLowerCase())
    );

    if (!turnoEncontrado) {
      return res.status(400).json({
        success: false,
        message: `Turno no válido. Usa: ${turnosValidos.join(", ")}`
      });
    }


    const filters: any[] = [
      {
        "horarios_disponibles.nombre": new RegExp(escapeRegex(turnoEncontrado), "i")
      },
      { activo: true }
    ];


    if (ciudad && typeof ciudad === 'string' && ciudad.trim()) {
      const ciudadRegex = new RegExp(escapeRegex(ciudad.trim()), "i");
      filters.push({ "ciudad.nombre": ciudadRegex });
    }

    const [resultados, total] = await Promise.all([
      usuarios.find(
        { $and: filters },
        {
          projection: {
            _id: 1,
            id_usuario: 1,
            nombre: 1,
            telefono: 1,
            email: 1,
            ciudad: 1,
            horarios_disponibles: 1,
            servicios: 1,
            especialidades: 1
          }
        }
      )
        .sort({ nombre: 1 })
        .skip(skip)
        .limit(pageSize)
        .toArray(),

      usuarios.countDocuments({ $and: filters })
    ]);

    res.json({
      success: true,
      total,
      page: currentPage,
      pageSize: pageSize,
      data: resultados,
      turno_buscado: turnoEncontrado
    });

  } catch (error: any) {
    console.error("Error en búsqueda por disponibilidad:", error);
    handleError(error, res);
  }
};


export const buscarPorZona = async (req: Request, res: Response) => {
  try {
    const { zona, ciudad, page = "1", limit = "50" } = req.query;

    if (!zona || typeof zona !== 'string' || !zona.trim()) {
      return res.status(400).json({
        success: false,
        message: "El parámetro 'zona' es requerido"
      });
    }

    const zonaNombre = zona.trim();
    const pageSize = Math.min(Number(limit) || 50, 200);
    const currentPage = Math.max(Number(page) || 1, 1);
    const skip = (currentPage - 1) * pageSize;

    const db = await getDatabase();
    if (!db) {
      return res.status(500).json({
        success: false,
        message: "Error de conexión con la base de datos"
      });
    }

    const usuarios = db.collection('usuarios');

    const zonasValidas = ["Norte", "Sur", "Este", "Oeste", "Centro"];
    const zonaEncontrada = zonasValidas.find(z =>
      z.toLowerCase().includes(zonaNombre.toLowerCase())
    );

    if (!zonaEncontrada) {
      return res.status(400).json({
        success: false,
        message: `Zona no válida. Usa: ${zonasValidas.join(", ")}`
      });
    }


    const filters: any[] = [
      {
        "zona.nombre": new RegExp(escapeRegex(zonaEncontrada), "i")
      },
      { activo: true }
    ];


    if (ciudad && typeof ciudad === 'string' && ciudad.trim()) {
      const ciudadRegex = new RegExp(escapeRegex(ciudad.trim()), "i");
      filters.push({ "ciudad.nombre": ciudadRegex });
    }

    const [resultados, total] = await Promise.all([
      usuarios.find(
        { $and: filters },
        {
          projection: {
            _id: 1,
            id_usuario: 1,
            nombre: 1,
            telefono: 1,
            email: 1,
            ciudad: 1,
            zona: 1,
            horarios_disponibles: 1,
            servicios: 1,
            especialidades: 1
          }
        }
      )
        .sort({ nombre: 1 })
        .skip(skip)
        .limit(pageSize)
        .toArray(),

      usuarios.countDocuments({ $and: filters })
    ]);

    res.json({
      success: true,
      total,
      page: currentPage,
      pageSize: pageSize,
      data: resultados,
      zona_buscada: zonaEncontrada
    });

  } catch (error: any) {
    console.error("Error en búsqueda por zona:", error);
    handleError(error, res);
  }
};

export const buscarPorAnosExperiencia = async (req: Request, res: Response) => {
  try {
    const {
      años,        // Búsqueda exacta
      años_min,    // Mínimo de años
      años_max,    // Máximo de años
      page = "1",
      limit = "50"
    } = req.query;

    // Validar que al menos un parámetro de años esté presente
    if (!años && !años_min && !años_max) {
      return res.status(400).json({
        success: false,
        message: "Debe proporcionar al menos un parámetro: 'años', 'años_min' o 'años_max'"
      });
    }

    const pageSize = Math.min(Number(limit) || 50, 200);
    const currentPage = Math.max(Number(page) || 1, 1);
    const skip = (currentPage - 1) * pageSize;

    const db = await getDatabase();
    if (!db) {
      return res.status(500).json({
        success: false,
        message: "Error de conexión con la base de datos"
      });
    }

    const experiencias = db.collection('experiencia');
    const usuarios = db.collection('usuarios');

    // Construir filtro para años de experiencia
    const filters: any[] = [{ activo: true }];

    if (años) {
      // Búsqueda exacta
      filters.push({ años_experiencia: Number(años) });
    } else {
      // Búsqueda por rango
      const añosFilter: any = {};
      if (años_min) añosFilter.$gte = Number(años_min);
      if (años_max) añosFilter.$lte = Number(años_max);
      filters.push({ años_experiencia: añosFilter });
    }

    const pipeline = [
      { $match: { $and: filters } },
      {
        $lookup: {
          from: 'usuarios',
          localField: 'id_usuario',
          foreignField: 'id_usuario',
          as: 'usuario_info'
        }
      },
      { $unwind: { path: '$usuario_info', preserveNullAndEmptyArrays: false } },
      {
        $match: {
          'usuario_info.activo': true
        }
      },
      {
        $sort: {
          años_experiencia: -1,
          valoracion_promedio: -1
        }
      },
      { $skip: skip },
      { $limit: pageSize },
      {
        $project: {
          _id: 1,
          id_usuario: 1,
          años_experiencia: 1,
          nivel_experiencia: 1,
          proyectos_completados: 1,
          descripcion: 1,
          certificaciones: 1,
          valoracion_promedio: 1,
          'usuario_info.nombre': 1,
          'usuario_info.telefono': 1,
          'usuario_info.email': 1,
          'usuario_info.ciudad': 1,
          'usuario_info.foto_perfil': 1
        }
      }
    ];

    const [resultados, total] = await Promise.all([
      experiencias.aggregate(pipeline).toArray(),
      experiencias.countDocuments({ $and: filters })
    ]);

    res.json({
      success: true,
      total,
      page: currentPage,
      pageSize: pageSize,
      totalPages: Math.ceil(total / pageSize),
      filtro: {
        tipo: años ? 'exacto' : 'rango',
        años: años || null,
        años_min: años_min || null,
        años_max: años_max || null
      },
      data: resultados
    });

  } catch (error: any) {
    console.error("Error en búsqueda por años de experiencia:", error);
    handleError(error, res);
  }
};

export const buscarPorRangoPrecio = async (req: Request, res: Response) => {
  try {
    const {
      precio_min,    // Precio mínimo
      precio_max,    // Precio máximo
      page = "1",
      limit = "50"
    } = req.query;

    // Validar que al menos un parámetro de precio esté presente
    if (!precio_min && !precio_max) {
      return res.status(400).json({
        success: false,
        message: "Debe proporcionar al menos un parámetro: 'precio_min' o 'precio_max'"
      });
    }

    // Validar que los precios sean números válidos
    if (precio_min && isNaN(Number(precio_min))) {
      return res.status(400).json({
        success: false,
        message: "El parámetro 'precio_min' debe ser un número válido"
      });
    }

    if (precio_max && isNaN(Number(precio_max))) {
      return res.status(400).json({
        success: false,
        message: "El parámetro 'precio_max' debe ser un número válido"
      });
    }

    // Validar que precio_min no sea mayor que precio_max
    if (precio_min && precio_max && Number(precio_min) > Number(precio_max)) {
      return res.status(400).json({
        success: false,
        message: "El precio mínimo no puede ser mayor que el precio máximo"
      });
    }

    const pageSize = Math.min(Number(limit) || 50, 200);
    const currentPage = Math.max(Number(page) || 1, 1);
    const skip = (currentPage - 1) * pageSize;

    const db = await getDatabase();
    if (!db) {
      return res.status(500).json({
        success: false,
        message: "Error de conexión con la base de datos"
      });
    }

    const servicios = db.collection('servicios'); // Ajusta el nombre de la colección

    // Construir filtro para precio
    const filters: any[] = [];

    const precioFilter: any = {};
    if (precio_min) precioFilter.$gte = Number(precio_min);
    if (precio_max) precioFilter.$lte = Number(precio_max);

    filters.push({ precio_base: precioFilter });

    const pipeline = [
      { $match: { $and: filters } },
      {
        $sort: {
          precio_base: 1, // Ordenar por precio ascendente
          nombre: 1
        }
      },
      { $skip: skip },
      { $limit: pageSize },
      {
        $project: {
          _id: 1,
          id_servicio: 1,
          nombre: 1,
          descripcion: 1,
          precio_base: 1,
          duracion_estimada: 1,
          fecha_creacion: 1
        }
      }
    ];

    const [resultados, total] = await Promise.all([
      servicios.aggregate(pipeline).toArray(),
      servicios.countDocuments({ $and: filters })
    ]);

    // Calcular estadísticas de precios
    const statsPipeline = [
      { $match: { $and: filters } },
      {
        $group: {
          _id: null,
          precio_promedio: { $avg: "$precio_base" },
          precio_minimo: { $min: "$precio_base" },
          precio_maximo: { $max: "$precio_base" },
          total_servicios: { $sum: 1 }
        }
      }
    ];

    const statsResult = await servicios.aggregate(statsPipeline).toArray();
    const estadisticas = statsResult[0] || {};

    res.json({
      success: true,
      total,
      page: currentPage,
      pageSize: pageSize,
      totalPages: Math.ceil(total / pageSize),
      filtro: {
        precio_min: precio_min || null,
        precio_max: precio_max || null,
        rango: precio_min && precio_max ?
          `${precio_min} - ${precio_max}` :
          precio_min ? `≥ ${precio_min}` : `≤ ${precio_max}`
      },
      estadisticas: {
        precio_promedio: estadisticas.precio_promedio ?
          Math.round(estadisticas.precio_promedio * 100) / 100 : 0,
        precio_minimo: estadisticas.precio_minimo || 0,
        precio_maximo: estadisticas.precio_maximo || 0,
        total_servicios: estadisticas.total_servicios || 0
      },
      data: resultados
    });

  } catch (error: any) {
    console.error("Error en búsqueda por rango de precio:", error);
    handleError(error, res);
  }
};

export const buscarPorFechaCreacion = async (req: Request, res: Response) => {
  try {
    const {
      fecha_inicio,    // Fecha de inicio (YYYY-MM-DD)
      fecha_fin,       // Fecha de fin (YYYY-MM-DD)
      fecha_exacta,    // Fecha exacta (YYYY-MM-DD)
      orden = "desc",  // Orden: "asc" o "desc"
      page = "1",
      limit = "50"
    } = req.query;

    // Validar que al menos un parámetro de fecha esté presente
    if (!fecha_inicio && !fecha_fin && !fecha_exacta) {
      return res.status(400).json({
        success: false,
        message: "Debe proporcionar al menos un parámetro: 'fecha_inicio', 'fecha_fin' o 'fecha_exacta'"
      });
    }

    // Validar formato de fechas
    const isValidDate = (dateString: string) => {
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      if (!regex.test(dateString)) return false;
      const date = new Date(dateString);
      return date instanceof Date && !isNaN(date.getTime());
    };

    if (fecha_inicio && !isValidDate(fecha_inicio as string)) {
      return res.status(400).json({
        success: false,
        message: "Formato de 'fecha_inicio' inválido. Use YYYY-MM-DD"
      });
    }

    if (fecha_fin && !isValidDate(fecha_fin as string)) {
      return res.status(400).json({
        success: false,
        message: "Formato de 'fecha_fin' inválido. Use YYYY-MM-DD"
      });
    }

    if (fecha_exacta && !isValidDate(fecha_exacta as string)) {
      return res.status(400).json({
        success: false,
        message: "Formato de 'fecha_exacta' inválido. Use YYYY-MM-DD"
      });
    }

    // Validar que fecha_inicio no sea mayor que fecha_fin
    if (fecha_inicio && fecha_fin) {
      const startDate = new Date(fecha_inicio as string);
      const endDate = new Date(fecha_fin as string);

      if (startDate > endDate) {
        return res.status(400).json({
          success: false,
          message: "La fecha de inicio no puede ser mayor que la fecha de fin"
        });
      }
    }

    const pageSize = Math.min(Number(limit) || 50, 200);
    const currentPage = Math.max(Number(page) || 1, 1);
    const skip = (currentPage - 1) * pageSize;

    const db = await getDatabase();
    if (!db) {
      return res.status(500).json({
        success: false,
        message: "Error de conexión con la base de datos"
      });
    }

    const servicios = db.collection('servicios');

    // Construir filtro para fecha
    const filters: any[] = [];

    if (fecha_exacta) {
      // Búsqueda por fecha exacta
      const exactDate = new Date(fecha_exacta as string);
      const nextDay = new Date(exactDate);
      nextDay.setDate(nextDay.getDate() + 1);

      filters.push({
        fecha_creacion: {
          $gte: exactDate,
          $lt: nextDay
        }
      });
    } else {
      // Búsqueda por rango de fechas
      const fechaFilter: any = {};

      if (fecha_inicio) {
        fechaFilter.$gte = new Date(fecha_inicio as string);
      }

      if (fecha_fin) {
        const endDate = new Date(fecha_fin as string);
        endDate.setDate(endDate.getDate() + 1); // Incluir todo el día de fin
        fechaFilter.$lt = endDate;
      }

      if (Object.keys(fechaFilter).length > 0) {
        filters.push({ fecha_creacion: fechaFilter });
      }
    }

    // Determinar orden
    const sortOrder = orden === "asc" ? 1 : -1;

    const pipeline = [
      { $match: { $and: filters } },
      {
        $sort: {
          fecha_creacion: sortOrder,
          nombre: 1
        }
      },
      { $skip: skip },
      { $limit: pageSize },
      {
        $project: {
          _id: 1,
          id_servicio: 1,
          nombre: 1,
          descripcion: 1,
          precio_base: 1,
          duracion_estimada: 1,
          fecha_creacion: 1,
          // Formatear fecha para respuesta
          fecha_formateada: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$fecha_creacion"
            }
          },
          dia_semana: {
            $dayOfWeek: "$fecha_creacion"
          }
        }
      }
    ];

    const [resultados, total] = await Promise.all([
      servicios.aggregate(pipeline).toArray(),
      servicios.countDocuments({ $and: filters })
    ]);

    // Calcular estadísticas de fechas
    const statsPipeline = [
      { $match: { $and: filters } },
      {
        $group: {
          _id: null,
          fecha_mas_antigua: { $min: "$fecha_creacion" },
          fecha_mas_reciente: { $max: "$fecha_creacion" },
          total_servicios: { $sum: 1 },
          servicios_por_mes: {
            $push: {
              mes: { $month: "$fecha_creacion" },
              año: { $year: "$fecha_creacion" }
            }
          }
        }
      }
    ];

    const statsResult = await servicios.aggregate(statsPipeline).toArray();
    const estadisticas = statsResult[0] || {};

    res.json({
      success: true,
      total,
      page: currentPage,
      pageSize: pageSize,
      totalPages: Math.ceil(total / pageSize),
      filtro: {
        fecha_inicio: fecha_inicio || null,
        fecha_fin: fecha_fin || null,
        fecha_exacta: fecha_exacta || null,
        orden: orden
      },
      estadisticas: {
        fecha_mas_antigua: estadisticas.fecha_mas_antigua || null,
        fecha_mas_reciente: estadisticas.fecha_mas_reciente || null,
        total_servicios: estadisticas.total_servicios || 0,
        rango_fechas: fecha_inicio && fecha_fin ?
          `${fecha_inicio} a ${fecha_fin}` :
          fecha_exacta ? `Fecha exacta: ${fecha_exacta}` : 'Personalizado'
      },
      data: resultados
    });

  } catch (error: any) {
    console.error("Error en búsqueda por fecha de creación:", error);
    handleError(error, res);
  }
};

