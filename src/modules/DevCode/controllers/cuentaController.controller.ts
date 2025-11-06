import { Request, Response }    from "express";
import * as cuentaService from "../services/cuentaService.service";
import * as transaccionService from "../services/transaccionService.service";

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
    const userId = (req as any).user.id; // <-- Ajusta esto
    const cuenta = await cuentaService.getCuentaById(userId);

    if (!cuenta) {
      return res.status(404).json({ mensaje: "Cuenta no encontrada" });
    }

    let transacciones: any | any[] = await transaccionService.getTransaccionById(String(cuenta._id));

    if (!transacciones) {
      transacciones = [];
    } else if (!Array.isArray(transacciones)) {
      transacciones = [transacciones];
    }
    const historial = (transacciones as any[]).map((tx: any) => ({
      fecha: tx.fecha,
      descripcion: tx.descripcion,
      monto: tx.monto,
      tipo: tx.tipo, 
    }));

    res.json(historial);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener historial", error });
  }
};


