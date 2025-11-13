import { Request, Response } from "express";
import { getDatabase } from "../config/conecction";

// Reutiliza la misma normalización que en busqueda.controller
const normalize = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0000-\u036f]/g, "")
    .replace(/[“”‘’\"']/g, "")
    .replace(/\s+/g, " ")
    .trim();

const validCharsRegex = /^[a-záéíóúñü\s´,\-]+$/i;

export const serviciosAvanzada = async (req: Request, res: Response) => {
  try {
    const { q: searchTerm, limit = 10 } = req.query;

    if (!searchTerm || typeof searchTerm !== "string") {
      return res.json({ success: true, total: 0, data: [] });
    }

    if (searchTerm.length > 120) {
      return res.status(400).json({ success: false, message: "La consulta es demasiado larga." });
    }

    const trimmed = normalize(searchTerm);
    if (!trimmed) return res.json({ success: true, total: 0, data: [] });

    if (!validCharsRegex.test(searchTerm)) {
      return res.status(400).json({ success: false, message: "Caracteres inválidos en la búsqueda." });
    }

    const db = await getDatabase();
    const servicios = db.collection("servicios");

    const regex = new RegExp(trimmed, "i");

    const resultados = await servicios
      .aggregate([
        {
          $addFields: {
            nombre_normalizado: { $toLower: { $replaceAll: { input: "$nombre", find: "ñ", replacement: "n" } } },
            descripcion_normalizada: { $toLower: { $replaceAll: { input: "$descripcion", find: "ñ", replacement: "n" } } },
          },
        },
        {
          $match: {
            $or: [{ nombre_normalizado: { $regex: regex } }, { descripcion_normalizada: { $regex: regex } }],
          },
        },
        { $project: { _id: 0, nombre: 1, descripcion: 1 } },
        { $limit: parseInt(limit as string) },
      ])
      .toArray();

    return res.json({ success: true, total: resultados.length, data: resultados });
  } catch (err: any) {
    console.error("Error en /search/avanzada/servicios:", err);
    return res.status(500).json({ success: false, message: err?.message ?? "Error interno" });
  }
};

export const disponibilidadAvanzada = async (req: Request, res: Response) => {
  try {
    // Opciones comunes de disponibilidad
    const opciones = ["Mañana", "Tarde", "Noche", "Fines de semana"];
    return res.json({ success: true, total: opciones.length, data: opciones });
  } catch (err: any) {
    console.error("Error en /search/avanzada/disponibilidad:", err);
    return res.status(500).json({ success: false, message: err?.message ?? "Error interno" });
  }
};

export const zonaAvanzada = async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const usuarios = db.collection("usuarios");

    // Devolver las ciudades únicas como 'zonas' (si no hay campo específico de zona)
    const ciudades: string[] = await usuarios.distinct("ciudad.nombre");
    const data = (ciudades || []).filter(Boolean).map((nombre) => ({ nombre }));

    return res.json({ success: true, total: data.length, data });
  } catch (err: any) {
    console.error("Error en /search/avanzada/zona:", err);
    return res.status(500).json({ success: false, message: err?.message ?? "Error interno" });
  }
};

export const experienciaAvanzada = async (req: Request, res: Response) => {
  try {
    // Rangos de experiencia sugeridos
    const opciones = [
      { id: "0-1", label: "Menos de 1 año" },
      { id: "1-3", label: "1 a 3 años" },
      { id: "3-5", label: "3 a 5 años" },
      { id: "5+", label: "Más de 5 años" },
    ];
    return res.json({ success: true, total: opciones.length, data: opciones });
  } catch (err: any) {
    console.error("Error en /search/avanzada/experiencia:", err);
    return res.status(500).json({ success: false, message: err?.message ?? "Error interno" });
  }
};

export const precioAvanzada = async (req: Request, res: Response) => {
  try {
    const opciones = [
      { id: "0-50", label: "0 - 50 Bs" },
      { id: "50-150", label: "50 - 150 Bs" },
      { id: "150-300", label: "150 - 300 Bs" },
      { id: "300+", label: "Más de 300 Bs" },
    ];
    return res.json({ success: true, total: opciones.length, data: opciones });
  } catch (err: any) {
    console.error("Error en /search/avanzada/precio:", err);
    return res.status(500).json({ success: false, message: err?.message ?? "Error interno" });
  }
};

export const fechaAvanzada = async (req: Request, res: Response) => {
  try {
    // Devuelve los próximos 14 días como opciones
    const dias: string[] = [];
    const hoy = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(hoy);
      d.setDate(hoy.getDate() + i);
      dias.push(d.toISOString().slice(0, 10));
    }
    return res.json({ success: true, total: dias.length, data: dias });
  } catch (err: any) {
    console.error("Error en /search/avanzada/fecha:", err);
    return res.status(500).json({ success: false, message: err?.message ?? "Error interno" });
  }
};
