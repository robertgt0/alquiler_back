// src/modules/dev_los_borbotones/controllers/filtros.controller.ts
import { Request, Response } from "express";
import Usuario from "../models/usuarios.model";
import City from "../models/city.model";
import Provincia from "../models/provincia.model";

/* ========= Utils ========= */
function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* =======================================================
 *  Filtro: Usuarios por CIUDAD (nombre o id_ciudad)
 *  - Query:  GET /api/borbotones/filstros/usuarios/ciudad?ciudad=Barcelona
 *  - Param:  GET /api/borbotones/filstros/usuarios/ciudad/Barcelona
 *  - Query2: GET /api/borbotones/filstros/usuarios/ciudad?id_ciudad=14
 *  - Además resuelve id_ciudad consultando la colección 'ciudades'
 * ======================================================= */
export const usuariosPorCiudad = async (req: Request, res: Response) => {
  try {
    const idCiudadStr = (req.query.id_ciudad as string | undefined)?.trim();
    const rawNombre =
      (req.query.ciudad as string | undefined) ??
      (req.params.ciudad as string | undefined);
    const nombreCiudad = rawNombre?.trim();

    // Si llega id_ciudad, filtra directo
    if (idCiudadStr && idCiudadStr !== "" && !Number.isNaN(Number(idCiudadStr))) {
      const idCiudad = Number(idCiudadStr);

      const usuarios = await Usuario.find(
        { "ciudad.id_ciudad": idCiudad },
        {
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
        }
      )
        .limit(200)
        .lean();

      return res.json({ success: true, total: usuarios.length, data: usuarios });
    }

    if (!nombreCiudad) {
      return res.status(400).json({
        success: false,
        message: "Debes enviar la ciudad (?ciudad=... o /:ciudad) o ?id_ciudad=NUMERO",
      });
    }

    const regex = new RegExp(escapeRegex(nombreCiudad), "i");

    // 1) Buscar posibles id_ciudad en 'ciudades'
    const cities = await City.find({ nombre: regex }, { id_ciudad: 1 }).lean();
    const ids = cities
      .map((c: any) => c.id_ciudad)
      .filter((n: any) => typeof n === "number");

    // 2) OR: nombre embebido o id_ciudad resuelto
    const or: any[] = [{ "ciudad.nombre": regex }];
    if (ids.length > 0) or.push({ "ciudad.id_ciudad": { $in: ids } });

    const usuarios = await Usuario.find(
      { $or: or },
      {
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
      }
    )
      .limit(200)
      .lean();

    res.json({ success: true, total: usuarios.length, data: usuarios });
  } catch (err: any) {
    console.error("Error en /usuarios/ciudad:", err);
    res.status(500).json({ success: false, message: err?.message ?? "Error interno" });
  }
};

/* =======================================================
 *  Filtro: Usuarios por ESPECIALIDAD (nombre o id)
 *  - Por nombre: GET /api/borbotones/filstros/usuarios/especialidad?especialidad=Climatización
 *  - Por id:     GET /api/borbotones/filstros/usuarios/especialidad?especialidad_id=7
 *  - Param:      GET /api/borbotones/filstros/usuarios/especialidad/Climatización
 * ======================================================= */
export const usuariosPorEspecialidad = async (req: Request, res: Response) => {
  try {
    const rawNombre =
      (req.query.especialidad as string | undefined) ??
      (req.params.especialidad as string | undefined);
    const idParam = (req.query.especialidad_id as string | undefined)?.trim();

    const filtros: any = {};

    // Por ID exacto
    if (idParam && idParam !== "") {
      const id = Number(idParam);
      if (!Number.isNaN(id)) filtros["especialidades.id_especialidad"] = id;
    }

    // Por nombre (regex contains, case-insensitive)
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
      }
    )
      .limit(200)
      .lean();

    res.json({ success: true, total: usuarios.length, data: usuarios });
  } catch (err: any) {
    console.error("Error en /usuarios/especialidad:", err);
    res.status(500).json({ success: false, message: err?.message ?? "Error interno" });
  }
};

/* =======================================================
 *  Filtro: Usuarios por DISPONIBILIDAD de servicios
 *  - GET /api/borbotones/filstros/usuarios/disponible?disponible=true
 *  - GET /api/borbotones/filstros/usuarios/disponible?disponible=false
 *  - (Opcional) + servicio: ?servicio_id=7
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
      }
    )
      .limit(200)
      .lean();

    res.json({ success: true, total: usuarios.length, data: usuarios });
  } catch (err: any) {
    console.error("Error en /usuarios/disponible:", err);
    res.status(500).json({ success: false, message: err?.message ?? "Error interno" });
  }
};

/* =======================================================
 *  NUEVO: Provincias por CIUDAD
 *  - Por nombre:
 *      GET /api/borbotones/filstros/ciudad/provincias?ciudad=Vigo
 *      GET /api/borbotones/filstros/ciudad/Provincias/Vigo      (si montas ruta con :ciudad)
 *  - Por id_ciudad:
 *      GET /api/borbotones/filstros/ciudad/provincias?id_ciudad=14
 *  Respuesta: { success, ciudad, total, provincias[] }
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
      // buscar la ciudad por nombre (regex, case-insensitive)
      const regex = new RegExp(escapeRegex(nombreCiudad), "i");
      const city = await City.findOne({ nombre: regex }, { id_ciudad: 1, nombre: 1 }).lean();
      if (!city) {
        return res.status(404).json({ success: false, message: "Ciudad no encontrada" });
      }
      idCiudad = city.id_ciudad;
    } else {
      return res.status(400).json({
        success: false,
        message: "Debes enviar ?ciudad=Nombre o ?id_ciudad=NUMERO",
      });
    }

    // Listar provincias por id_ciudad (colección 'provincias')
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
