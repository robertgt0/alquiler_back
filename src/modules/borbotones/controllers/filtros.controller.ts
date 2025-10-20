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
    departamento: randomDept.charAt(0).toUpperCase() + randomDept.slice(1),
    ciudad: randomCity
  };
}

/* =======================================================
 *  Listado de CIUDADES
 * ======================================================= */
export const listarCiudades = async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string | undefined)?.trim();
    const limitRaw = Number(req.query.limit ?? 50);
    const pageRaw = Number(req.query.page ?? 1);

    // Soporte para filtrar solo ciudades de Bolivia
    const pais = (req.query.pais as string | undefined)?.trim()?.toLowerCase();
    const soloBolivia = pais === "bolivia" || pais === "bo" || req.query.soloBolivia === "true";

    const pageSize = Number.isNaN(limitRaw)
      ? 50
      : Math.min(Math.max(limitRaw, 1), 200);
    const page = Number.isNaN(pageRaw) ? 1 : Math.max(pageRaw, 1);
    const skip = (page - 1) * pageSize;

    const filter: any = {};
    if (q && q !== "") filter.nombre = new RegExp(escapeRegex(q), "i");

    if (soloBolivia) {
      // Si el cliente pide solo Bolivia, restringimos la búsqueda a nombres presentes en la lista
      // Construimos la lista a partir de boliviaDeptCities (concat + unique)
      const allCities = Object.values(boliviaDeptCities).flat().map((c) => c.toLowerCase());
      const unique = Array.from(new Set(allCities));
      const escaped = unique.map((c) => escapeRegex(c)).join("|");
      const bolRegex = new RegExp(`^(${escaped})$`, "i");
      // Si ya había q, combinamos (nombre que contiene q) y (pertenece a la lista)
      if (filter.nombre) {
        // Se busca que el nombre contenga q y además sea una ciudad boliviana: usamos $and
        filter.$and = [ { nombre: filter.nombre }, { nombre: bolRegex } ];
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

    // Añadir ubicación aleatoria a cada resultado
    const dataWithLocation = data.map(item => {
      const location = getRandomLocation();
      return {
        ...item,
        departamento: location.departamento,
        ciudad: location.ciudad
      };
    });

    res.json({ success: true, total, page, pageSize, data: dataWithLocation });
  } catch (err: any) {
    console.error("Error en /filstros/ciudades:", err);
    res.status(500).json({ success: false, message: err?.message ?? "Error interno" });
  }
};

/* =======================================================
 *  Listado de DEPARTAMENTOS (Bolivia)
 *  Endpoint simple que devuelve lista estática
 * ======================================================= */
export const listarDepartamentos = async (_req: Request, res: Response) => {
  try {
    // Los departamentos ya son strings, no necesitamos mapear
    res.json({ success: true, total: boliviaDepartments.length, data: boliviaDepartments });
  } catch (err: any) {
    console.error("Error en /departamentos:", err);
    res.status(500).json({ success: false, message: err?.message ?? "Error interno" });
  }
};

/* =======================================================
 *  Ciudades por departamento (Bolivia) - endpoint estático
 *  Query: ?departamento=Nombre
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
 *  Listado de ESPECIALIDADES (únicas)
 * ======================================================= */
export const listarEspecialidades = async (_req: Request, res: Response) => {
  try {
    const rows = await Usuario.aggregate([
      { $unwind: "$especialidades" },
      {
        $group: {
          _id: {
            id: "$especialidades.id_especialidad",
            nombre: "$especialidades.nombre",
          },
        },
      },
      {
        $project: {
          _id: 0,
          id_especialidad: "$_id.id",
          nombre: "$_id.nombre",
        },
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
 *  Usuarios por CIUDAD
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
        {
          _id: 1, id_usuario: 1, nombre: 1, email: 1, telefono: 1, activo: 1,
          fecha_registro: 1, ciudad: 1, especialidades: 1, servicios: 1,
        }
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
      {
        _id: 1, id_usuario: 1, nombre: 1, email: 1, telefono: 1, activo: 1,
        fecha_registro: 1, ciudad: 1, especialidades: 1, servicios: 1,
      }
    ).limit(200).lean();

    res.json({ success: true, total: usuarios.length, data: usuarios });
  } catch (err: any) {
    console.error("Error en /usuarios/ciudad:", err);
    res.status(500).json({ success: false, message: err?.message ?? "Error interno" });
  }
};

/* =======================================================
 *  Usuarios por ESPECIALIDAD
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
      {
        _id: 1, id_usuario: 1, nombre: 1, email: 1, telefono: 1, activo: 1,
        fecha_registro: 1, ciudad: 1, especialidades: 1, servicios: 1,
      }
    ).limit(200).lean();

    res.json({ success: true, total: usuarios.length, data: usuarios });
  } catch (err: any) {
    console.error("Error en /usuarios/especialidad:", err);
    res.status(500).json({ success: false, message: err?.message ?? "Error interno" });
  }
};

/* =======================================================
 *  Usuarios por DISPONIBILIDAD
 * ======================================================= */
export const usuariosPorDisponibilidad = async (req: Request, res: Response) => {
  try {
    const disponibleStr = (req.query.disponible as string | undefined)?.trim();
    const servicioIdStr = (req.query.servicio_id as string | undefined)?.trim();

    if (disponibleStr !== "true" && disponibleStr !== "false") {
      return res.status(400).json({
        success: false,
        message: "Debes enviar ?disponible=true o ?disponible=false",
      });
    }

    const disponible = disponibleStr === "true";
    const filtro: any = { "servicios.disponible": disponible };

    if (servicioIdStr) {
      const sid = Number(servicioIdStr);
      if (!Number.isNaN(sid)) filtro["servicios.id_servicio"] = sid;
    }

    const usuarios = await Usuario.find(
      filtro,
      {
        _id: 1, id_usuario: 1, nombre: 1, email: 1, telefono: 1, activo: 1,
        fecha_registro: 1, ciudad: 1, especialidades: 1, servicios: 1,
      }
    ).limit(200).lean();

    res.json({ success: true, total: usuarios.length, data: usuarios });
  } catch (err: any) {
    console.error("Error en /usuarios/disponible:", err);
    res.status(500).json({ success: false, message: err?.message ?? "Error interno" });
  }
};

/* =======================================================
 *  Provincias por CIUDAD
 * ======================================================= */
export const provinciasPorCiudad = async (req: Request, res: Response) => {
  try {
    const idCiudadStr = (req.query.id_ciudad as string | undefined)?.trim();
    const rawNombre =
      (req.query.ciudad as string | undefined) ??
      (req.params.ciudad as string | undefined);
    const nombreCiudad = rawNombre?.trim();

    let idCiudad: number | null = null;

    if (idCiudadStr && !Number.isNaN(Number(idCiudadStr))) {
      idCiudad = Number(idCiudadStr);
    } else if (nombreCiudad && nombreCiudad !== "") {
      const regex = new RegExp(escapeRegex(nombreCiudad), "i");
      const city = await City.findOne({ nombre: regex }, { id_ciudad: 1, nombre: 1 }).lean();
      if (!city) return res.status(404).json({ success: false, message: "Ciudad no encontrada" });
      idCiudad = city.id_ciudad;
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
      ciudad: { id_ciudad: idCiudad, nombre: nombreCiudad ?? undefined },
      total: provincias.length,
      provincias,
    });
  } catch (err: any) {
    console.error("Error en /ciudad/provincias:", err);
    res.status(500).json({ success: false, message: err?.message ?? "Error interno" });
  }
};

/* =======================================================
 *  NUEVO: Usuarios por NOMBRE de SERVICIO
 * ======================================================= */
export const usuariosPorServicio = async (req: Request, res: Response) => {
  try {
    const servicioNombre = (req.query.servicio as string | undefined)?.trim();
    if (!servicioNombre)
      return res.status(400).json({ success: false, message: "Debes enviar ?servicio=Nombre" });

    const disponibleStr = (req.query.disponible as string | undefined)?.trim();
    const ciudadNombre = (req.query.ciudad as string | undefined)?.trim();
    const idCiudadStr = (req.query.id_ciudad as string | undefined)?.trim();

    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const page = Math.max(Number(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;

    const servicioRegex = new RegExp(escapeRegex(servicioNombre), "i");
    const elemCond: any = { nombre: { $regex: servicioRegex } };
    if (disponibleStr === "true" || disponibleStr === "false")
      elemCond.disponible = disponibleStr === "true";

    const andMatch: any[] = [{ servicios: { $elemMatch: elemCond } }];

    if (idCiudadStr && !Number.isNaN(Number(idCiudadStr))) {
      andMatch.push({ "ciudad.id_ciudad": Number(idCiudadStr) });
    } else if (ciudadNombre && ciudadNombre !== "") {
      const ciudades = await City.find(
        { nombre: new RegExp(escapeRegex(ciudadNombre), "i") },
        { id_ciudad: 1 }
      ).lean();
      const ids = ciudades.map((c) => c.id_ciudad).filter((n) => typeof n === "number");
      if (ids.length > 0) andMatch.push({ "ciudad.id_ciudad": { $in: ids } });
    }

    const pipeline: any[] = [
      { $match: { $and: andMatch } },
      {
        $addFields: {
          servicios: {
            $filter: {
              input: "$servicios",
              as: "s",
              cond: {
                $and: [
                  // ✅ corregido: sin options
                  { $regexMatch: { input: "$$s.nombre", regex: servicioRegex } },
                  ...(disponibleStr === "true" || disponibleStr === "false"
                    ? [{ $eq: ["$$s.disponible", disponibleStr === "true"] }]
                    : []),
                ],
              },
            },
          },
        },
      },
      { $sort: { nombre: 1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          id_usuario: 1,
          nombre: 1,
          email: 1,
          telefono: 1,
          activo: 1,
          fecha_registro: 1,
          ciudad: 1,
          especialidades: 1,
          servicios: 1,
        },
      },
    ];

    const data = await Usuario.aggregate(pipeline).exec();
    const total = await Usuario.countDocuments({ $and: andMatch });

    res.json({ success: true, total, page, pageSize: limit, data });
  } catch (err: any) {
    console.error("Error en /usuarios/servicio:", err);
    res.status(500).json({ success: false, message: err?.message ?? "Error interno" });
  }
};
