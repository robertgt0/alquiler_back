import { Request, Response } from "express";
import * as transaccionService from "../services/transaccionService.service";

export const createTransaccion = async (req: Request, res: Response) => {
    try {
        const transaccion = await transaccionService.createTransaccion(req.body);
        res.status(201).json({ success: true, data: transaccion });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const getTransacciones = async (_req: Request, res: Response) => {
    try {
        const transacciones = await transaccionService.getTransacciones();
        res.status(200).json({ success: true, data: transacciones });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const getTransaccionById = async (req: Request, res: Response) => {
    try {
        const transaccion = await transaccionService.getTransaccionById(req.params.id);
        if (!transaccion) return res.status(404).json({ success: false, message: "Transacción no encontrada" });
        res.status(200).json({ success: true, data: transaccion });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }   
};

export const updateTransaccion = async (req: Request, res: Response) => {
    try {
        const transaccion = await transaccionService.updateTransaccion(req.params.id, req.body);
        if (!transaccion) return res.status(404).json({ success: false, message: "Transacción no encontrada" });
        res.status(200).json({ success: true, message: "Transacción actualizada correctamente", data: transaccion });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }   
};

export const deleteTransaccion = async (req: Request, res: Response) => {
    try {
        const transaccion = await transaccionService.deleteTransaccion(req.params.id);
        if (!transaccion) return res.status(404).json({ success: false, message: "Transacción no encontrada" });
        res.status(200).json({ success: true, message: "Transacción eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }   
};

