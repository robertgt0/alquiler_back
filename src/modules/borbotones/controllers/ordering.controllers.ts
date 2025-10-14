import { Request, Response } from "express";
const Usuario = require('../models/Usuarios'); // 👈 nombre corregido (coincide con tu find)
import Especialidades from "../models/Especialidades";

// Obtener todos los especialistas con diferentes tipos de ordenamiento
export const ordenarUsuarios = async (req: Request, res: Response) => {
  try {
    const { orden } = req.query;

    let especialistas;

    //Si el orden es por calificación, necesitamos calcular el promedio
    if (orden === "calificacion") {
      especialistas = await Usuario.aggregate([
        {
          $addFields: {
            promedioCalificacion: {
              $cond: {
                if: { $gt: [{ $size: "$calificaciones" }, 0] },
                then: { $avg: "$calificaciones.puntuacion" },
                else: 0
              }
            }
          }
        },
        { $sort: { promedioCalificacion: -1 } } //mayor calificación primero
      ]);
    } else {
      //Para otros tipos de orden usamos sort() normal
      let criterioOrden: Record<string, 1 | -1> = {};

      switch (orden) {
        case "nombre_A-Z":
          criterioOrden = { nombre: 1 }; // A-Z
          break;
          case "nombre_Z-A":
            criterioOrden = { nombre: -1 }; // Z-A
            break;
        case "fecha":
          criterioOrden = { fecha_registro: -1 }; // más recientes primero
          break;
        default:
          criterioOrden = { nombre: 1 };
          break;
      }

      especialistas = await Usuario.find().sort(criterioOrden);
    }

    if (!especialistas || especialistas.length === 0) {
      return res.status(404).json({ message: "No hay especialistas en la base de datos." });
    }

    //Enviar respuesta
    res.status(200).json({
      total: especialistas.length,
      orden_usado: orden || "nombre",
      data: especialistas,
    });
  } catch (error) {
    console.error("Error al obtener especialistas:", error);
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};
