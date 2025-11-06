import { Request, Response }    from "express";
import * as cuentaService from "../services/cuentaService.service";
import * as transaccionService from "../services/transaccionService.service";
import { Transaccion, ITransaccion } from "@/models/transaccion.model";

export const createCuenta = async (req: Request, res: Response) => {
    try {
        const cuenta = await cuentaService.createCuenta(req.body);
        res.status(201).json({ success: true, data: cuenta });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const getCuentas = async (_req: Request, res: Response) => {
    try {
        const cuentas = await cuentaService.getCuentas();
        res.status(200).json({ success: true, data: cuentas });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const getCuentaById = async (req: Request, res: Response) => {
    try {
        const cuenta = await cuentaService.getCuentaById(req.params.id);
        if (!cuenta) return res.status(404).json({ success: false, message: "Cuenta no encontrada" });
        res.status(200).json({ success: true, data: cuenta });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const updateCuenta = async (req: Request, res: Response) => {
    try {
        const cuenta = await cuentaService.updateCuenta(req.params.id, req.body);
        if (!cuenta) return res.status(404).json({ success: false, message: "Cuenta no encontrada" });
        res.status(200).json({ success: true, message: "Cuenta actualizada correctamente", data: cuenta });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const deleteCuenta = async (req: Request, res: Response) => {
    try {
        const cuenta = await cuentaService.deleteCuenta(req.params.id);
        if (!cuenta) return res.status(404).json({ success: false, message: "Cuenta no encontrada" });
        res.status(200).json({ success: true, message: "Cuenta eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const obtenerSaldoActual = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id; 
        const cuenta = await cuentaService.getCuentaById(userId);

        if (!cuenta) {
        return res.status(404).json({ mensaje: "Cuenta no encontrada" });
        }
        res.json({
        saldo: cuenta.saldo,
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener el saldo", error });
    }
};


export const obtenerHistorialMovimientos = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;
    const cuenta = await cuentaService.getCuentaById(userId);

    if (!cuenta) {
      return res.status(404).json({ mensaje: "Cuenta no encontrada" });
    }

    // --- Inicio de AC 9 (Paginación) ---
    // Obtenemos 'page' y 'limit' de los query parameters de la URL
    // Ej: /api/historial?page=2&limit=5
    const pagina = parseInt(req.query.page as string, 10) || 1;
    const limite = parseInt(req.query.limit as string, 10) || 10; // Límite por defecto 10
    const skip = (pagina - 1) * limite;
    // --- Fin de AC 9 ---

    // Hacemos dos peticiones a la BD en paralelo para ser más eficientes
    const [transacciones, totalTransacciones] = await Promise.all([
        // 1. Buscamos las transacciones de esta página
        transaccionService.findPaginated({ cuentaId: cuenta._id }, skip, limite),

        // 2. Contamos el total (llamando al servicio)
        transaccionService.count({ cuentaId: cuenta._id }),
    ]);

    // --- Inicio de AC 6 (Mensaje si no hay transacciones) ---
    if (totalTransacciones === 0) {
      return res.status(200).json({
        mensaje: "Sin transacciones registradas",
        transacciones: [],
        totalPaginas: 0,
        paginaActual: 1,
      });
    }
    // --- Fin de AC 6 ---

    // AC 3: Mapeamos el resultado
    const historial = transacciones.map((tx) => ({
      cuentaId: tx.cuentaId, 
      fecha_pago: tx.fecha_pago,
      descripcion: tx.descripcion,
      monto: tx.monto,
      tipo: tx.tipo,
    }));

    // Enviamos la respuesta con los datos de paginación
    res.json({
      transacciones: historial,
      total: totalTransacciones,
      totalPaginas: Math.ceil(totalTransacciones / limite),
      paginaActual: pagina,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener historial", error });
  }
};
