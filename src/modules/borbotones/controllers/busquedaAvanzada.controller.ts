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