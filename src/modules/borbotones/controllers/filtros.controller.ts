import { Request, Response } from "express";
import Usuario from "../models/usuarios.model";
import City from "../models/city.model";
import Provincia from "../models/provincia.model";
import boliviaDepartments from "../config/boliviaDepartments";
import boliviaDeptCities from "../config/boliviaDeptCities";

/* ========= Utils ========= */
function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getRandomLocation() {
  const departments = Object.keys(boliviaDeptCities);
  const randomDept = departments[Math.floor(Math.random() * departments.length)];
  const cities = boliviaDeptCities[randomDept];
  const randomCity = cities[Math.floor(Math.random() * cities.length)];
  return {
    // Corregir capitalización a solo la primera letra
    departamento: randomDept.charAt(0).toUpperCase() + randomDept.slice(1), 
    ciudad: randomCity,
  };
}

// Campos comunes a proyectar en los resultados de usuario
// Asegurarnos de que id_usuario siempre esté presente y sea el identificador principal
const USER_PROJECTION = {
  id_usuario: 1, // ID principal para navegación y referencia
  nombre: 1,
  email: 1,
  telefono: 1,
  activo: 1,
  fecha_registro: 1,
  ciudad: 1,
  especialidades: 1,
  servicios: 1,
  descripcion: 1, // descripción del profesional (mostrada en las tarjetas)
};


/* =======================================================
 *  Listado de CIUDADES
 * ======================================================= */
export const listarCiudades = async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string | undefined)?.trim();
    const limitRaw = Number(req.query.limit ?? 50);
    const pageRaw = Number(req.query.page ?? 1);

    const pais = (req.query.pais as string | undefined)?.trim()?.toLowerCase();
    const soloBolivia = pais === "bolivia" || pais === "bo" || req.query.soloBolivia === "true";

    const pageSize = Number.isNaN(limitRaw) ? 50 : Math.min(Math.max(limitRaw, 1), 200);
    const page = Number.isNaN(pageRaw) ? 1 : Math.max(pageRaw, 1);
    const skip = (page - 1) * pageSize;

    const filter: any = {};
    if (q && q !== "") filter.nombre = new RegExp(escapeRegex(q), "i");

    if (soloBolivia) {
      const allCities = Object.values(boliviaDeptCities).flat().map((c) => c.toLowerCase());
      const unique = Array.from(new Set(allCities));
      const escaped = unique.map((c) => escapeRegex(c)).join("|");
      // Buscamos coincidencia exacta con los nombres de ciudades bolivianas (case insensitive)
      const bolRegex = new RegExp(`^(${escaped})$`, "i"); 
      
      if (filter.nombre) {
        // Se busca que el nombre contenga 'q' Y además sea una ciudad boliviana
        filter.$and = [{ nombre: filter.nombre }, { nombre: bolRegex }];
        delete filter.nombre;
      } else {
        filter.nombre = bolRegex;
      }
    }

    const [data, total] = await Promise.all([
      City.find(filter, { _id: 0, id_ciudad: 1, nombre: 1 })
        .sort({ nombre: 1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      City.countDocuments(filter),
    ]);

    // OJO: Añadir ubicación aleatoria a cada resultado
    // Esto parece ser para datos de ejemplo/mock, podría ser innecesario
    // si las ciudades en la DB ya tienen departamento/ciudad asociados.
    const dataWithLocation = data.map((item: any) => {
      const location = getRandomLocation();
      // Esto hace que la ciudad devuelta en el item (de la DB) 
      // tenga un campo 'departamento' y 'ciudad' (de Bolivia) AL AZAR.
      // La ciudad 'item.nombre' no está relacionada con 'location.departamento/ciudad'.
      return {
        ...item,
        departamento: location.departamento,
        ciudad: location.ciudad, // Ojo: esto sobreescribe item.ciudad si existiera, pero en la proyección se quitó
      };
    });

    res.json({ success: true, total, page, pageSize, data: dataWithLocation });
  } catch (err: any) {
    console.error("Error en /filstros/ciudades:", err);
    res.status(500).json({ success: false, message: err?.message ?? "Error interno" });
  }
};

/* =======================================================
 *  Listado de DEPARTAMENTOS (Bolivia)
 * ======================================================= */
export const listarDepartamentos = async (_req: Request, res: Response) => {
  try {
    res.json({ success: true, total: boliviaDepartments.length, data: boliviaDepartments });
  } catch (err: any) {
    console.error("Error en /departamentos:", err);
    res.status(500).json({ success: false, message: err?.message ?? "Error interno" });
  }
};

/* =======================================================
 *  Ciudades por departamento (Bolivia) - endpoint estático
 * ======================================================= */
export const ciudadesPorDepartamento = async (req: Request, res: Response) => {
  try {
    const departamentoRaw = (req.query.departamento as string | undefined)?.trim();
    if (!departamentoRaw) {
      return res.status(400).json({ success: false, message: "Debes enviar ?departamento=Nombre" });
    }
    const key = departamentoRaw.toLowerCase();
    const ciudades = boliviaDeptCities[key] ?? [];
    res.json({ success: true, total: ciudades.length, data: ciudades.map((c) => ({ id_ciudad: 0, nombre: c })) });
  } catch (err: any) {
    console.error("Error en /ciudades/por-departamento:", err);
    res.status(500).json({ success: false, message: err?.message ?? "Error interno" });
  }
};

/* =======================================================
 *  Listado de ESPECIALIDADES (únicas)
 * ======================================================= */
export const listarEspecialidades = async (_req: Request, res: Response) => {
  try {
    const rows = await Usuario.aggregate([
      { $unwind: "$especialidades" },
      {
        $group: {
          _id: { id: "$especialidades.id_especialidad", nombre: "$especialidades.nombre" },
        },
      },
      {
        $project: { _id: 0, id_especialidad: "$_id.id", nombre: "$_id.nombre" },
      },
      { $sort: { nombre: 1 } },
    ]);
    res.json({ success: true, total: rows.length, data: rows });
  } catch (err: any) {
    console.error("Error en /filstros/especialidades:", err);
    res.status(500).json({ success: false, message: err?.message ?? "Error interno" });
  }
};

/* =======================================================
 *  Usuarios por CIUDAD
 * ======================================================= */
export const usuariosPorCiudad = async (req: Request, res: Response) => {
  try {
    const idCiudadStr = (req.query.id_ciudad as string | undefined)?.trim();
    const rawNombre =
      (req.query.ciudad as string | undefined) ??
      (req.params.ciudad as string | undefined);
    const nombreCiudad = rawNombre?.trim();

    if (idCiudadStr && idCiudadStr !== "" && !Number.isNaN(Number(idCiudadStr))) {
      const idCiudad = Number(idCiudadStr);
      const usuarios = await Usuario.find(
        { "ciudad.id_ciudad": idCiudad },
        USER_PROJECTION
      ).limit(200).lean();
      return res.json({ success: true, total: usuarios.length, data: usuarios });
    }

    if (!nombreCiudad) {
      return res.status(400).json({
        success: false,
        message: "Debes enviar la ciudad (?ciudad=... o /:ciudad) o ?id_ciudad=NUMERO",
      });
    }

    const regex = new RegExp(escapeRegex(nombreCiudad), "i");
    const cities = await City.find({ nombre: regex }, { id_ciudad: 1 }).lean();
    const ids = cities.map((c: any) => c.id_ciudad).filter((n: any) => typeof n === "number");

    const or: any[] = [{ "ciudad.nombre": regex }];
    if (ids.length > 0) or.push({ "ciudad.id_ciudad": { $in: ids } });

    const usuarios = await Usuario.find(
      { $or: or }, 
      USER_PROJECTION
    ).limit(200).lean();
    
    res.json({ success: true, total: usuarios.length, data: usuarios });
  } catch (err: any) {
    console.error("Error en /usuarios/ciudad:", err);
    res.status(500).json({ success: false, message: err?.message ?? "Error interno" });
  }
};

/* =======================================================
 *  Usuarios por ESPECIALIDAD
 * ======================================================= */
export const usuariosPorEspecialidad = async (req: Request, res: Response) => {
  try {
    const rawNombre =
      (req.query.especialidad as string | undefined) ??
      (req.params.especialidad as string | undefined);
    const idParam = (req.query.especialidad_id as string | undefined)?.trim();

    const filtros: any = {};
    if (idParam && idParam !== "") {
      const id = Number(idParam);
      if (!Number.isNaN(id)) filtros["especialidades.id_especialidad"] = id;
    }
    if (rawNombre && rawNombre.trim() !== "") {
      const regex = new RegExp(escapeRegex(rawNombre.trim()), "i");
      filtros["especialidades.nombre"] = regex;
    }
    if (!filtros["especialidades.id_especialidad"] && !filtros["especialidades.nombre"]) {
      return res.status(400).json({
        success: false,
        message: "Debes enviar ?especialidad=Nombre o ?especialidad_id=NUMERO",
      });
    }

    const usuarios = await Usuario.find(
      filtros,
      USER_PROJECTION
    ).limit(200).lean();
    
    res.json({ success: true, total: usuarios.length, data: usuarios });
  } catch (err: any) {
    console.error("Error en /usuarios/especialidad:", err);
    res.status(500).json({ success: false, message: err?.message ?? "Error interno" });
  }
};

/* =======================================================
 *  Usuarios por DISPONIBILIDAD (Corregido)
 * ======================================================= */
export const usuariosPorDisponibilidad = async (req: Request, res: Response) => {
  try {
    const disponibleStr = (req.query.disponible as string | undefined)?.trim();
    
    // Corregido: solo se necesita el filtro de disponibilidad (activo)
    if (disponibleStr !== "true" && disponibleStr !== "false") {
      return res.status(400).json({
        success: false,
        message: "Debes enviar ?disponible=true o ?disponible=false",
      });
    }

    const estaDisponible = disponibleStr === "true";
    const usuarios = await Usuario.find(
      { activo: estaDisponible }, 
      USER_PROJECTION
    ).limit(200).lean();
    
    return res.json({ success: true, total: usuarios.length, data: usuarios });
  } catch (err: any) {
    console.error("Error en /usuarios/disponible:", err);
    res.status(500).json({ success: false, message: err?.message ?? "Error interno" });
  }
};

/* =======================================================
 *  Provincias por CIUDAD
 *  Asumo que este era el cuerpo al final del segundo bloque duplicado
 *  y lo separo como una nueva función completa.
 * ======================================================= */
export const provinciasPorCiudad = async (req: Request, res: Response) => {
  try {
    const idCiudadStr = (req.query.id_ciudad as string | undefined)?.trim();
    const rawNombre =
      (req.query.ciudad as string | undefined) ??
      (req.params.ciudad as string | undefined);
    const nombreCiudad = rawNombre?.trim();

    let idCiudad: number | null = null;
    let ciudadNombreEncontrada: string | undefined = undefined;

    if (idCiudadStr && !Number.isNaN(Number(idCiudadStr))) {
      idCiudad = Number(idCiudadStr);
      // Buscamos el nombre si se proporciona el ID
      const city = await City.findOne({ id_ciudad: idCiudad }, { nombre: 1 }).lean();
      if (city) ciudadNombreEncontrada = city.nombre;
    } else if (nombreCiudad && nombreCiudad !== "") {
      const regex = new RegExp(escapeRegex(nombreCiudad), "i");
      const city = await City.findOne({ nombre: regex }, { id_ciudad: 1, nombre: 1 }).lean();
      if (!city) return res.status(404).json({ success: false, message: "Ciudad no encontrada" });
      idCiudad = city.id_ciudad;
      ciudadNombreEncontrada = city.nombre;
    } else {
      return res.status(400).json({
        success: false,
        message: "Debes enviar ?ciudad=Nombre o ?id_ciudad=NUMERO",
      });
    }

    const provincias = await Provincia.find(
      { id_ciudad: idCiudad },
      { _id: 0, id_provincia: 1, nombre: 1, id_ciudad: 1 }
    ).lean();

    res.json({
      success: true,
      ciudad: { id_ciudad: idCiudad, nombre: ciudadNombreEncontrada },
      total: provincias.length,
      data: provincias, // Cambiado 'provincias' a 'data' por consistencia
    });
  } catch (err: any) {
    console.error("Error en /ciudad/provincias:", err);
    res.status(500).json({ success: false, message: err?.message ?? "Error interno" });
  }
};


/* =======================================================
 *  Usuarios por NOMBRE de SERVICIO (Corregido y Simplificado)
 * ======================================================= */
export const usuariosPorServicio = async (req: Request, res: Response) => {
  try {
    const servicioNombre = (req.query.servicio as string | undefined)?.trim();
    if (!servicioNombre)
      return res.status(400).json({ success: false, message: "Debes enviar ?servicio=Nombre" });

    const disponibleStr = (req.query.disponible as string | undefined)?.trim();
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const page = Math.max(Number(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;

    const servicioRegex = new RegExp(escapeRegex(servicioNombre), "i");

    // 1. Condición para el $match inicial: El usuario debe tener al menos un servicio que coincida con el nombre.
    const matchCondition: any = { "servicios.nombre": { $regex: servicioRegex } };
    
    // 2. Si se filtra por disponibilidad del servicio, añadimos la condición
    if (disponibleStr === "true" || disponibleStr === "false") {
      matchCondition["servicios.disponible"] = disponibleStr === "true";
    }

    const pipeline: any[] = [
      { $match: matchCondition }, // Filtramos usuarios que contienen el servicio (y opcionalmente su disponibilidad)
      { 
        $addFields: { // Reemplazamos el array de servicios solo con los que cumplen el filtro
          servicios: { 
            $filter: { 
              input: "$servicios", 
              as: "s", 
              cond: { 
                $and: [
                  { $regexMatch: { input: "$$s.nombre", regex: servicioRegex } },
                  ...(disponibleStr === "true" || disponibleStr === "false"
                    ? [{ $eq: ["$$s.disponible", disponibleStr === "true"] }]
                    : []),
                ],
              } 
            } 
          } 
        } 
      },
      // { $match: { "servicios.0": { $exists: true } } }, // No es necesario si el $match inicial fue eficiente
      { $sort: { nombre: 1 } },
      { $skip: skip },
      { $limit: limit },
      { $project: USER_PROJECTION },
    ];

    const data = await Usuario.aggregate(pipeline).exec();
    
    // El total se calcula sobre la condición inicial del $match
    const total = await Usuario.countDocuments(matchCondition); 

    res.json({ success: true, total, page, pageSize: limit, data });
  } catch (err: any) {
    console.error("Error en /usuarios/servicio:", err);
    res.status(500).json({ success: false, message: err?.message ?? "Error interno" });
  }
};