import { Request, Response } from "express";
import * as transaccionService from "../services/transaccionService.service";
import mongoose from "mongoose";
import { Cuenta, ICuenta } from "@/models/cuenta.model";
import { Transaccion, ITransaccion } from "@/models/transaccion.model";

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

//Actualizacion de saldo y creacion de transaccion en una sola operacion
export const crearNuevaTransaccion = async (req: Request, res: Response) => {
  
  const session = await mongoose.startSession();
  session.startTransaction();

    try {
        const userId = (req as any).user.id; 
        
        // 1. Obtenemos los datos del body
        const { monto, descripcion, tipo } = req.body;

        // Validación simple
        if (!monto || !tipo || (tipo !== "ingreso" && tipo !== "gasto")) {
        return res
            .status(400)
            .json({ mensaje: "Datos incompletos o 'tipo' inválido" });
        }
        const cuenta = await Cuenta.findOne({ propietario: userId }).session(session);
        if (!cuenta) {
        throw new Error("Cuenta no encontrada");
        }

        // 3. Calculamos el nuevo saldo
        let nuevoSaldo;
        if (tipo === "ingreso") {
        nuevoSaldo = cuenta.saldo + monto;
        } else {
        
            if (cuenta.saldo < monto) {
                throw new Error("Saldo insuficiente");
            }
        nuevoSaldo = cuenta.saldo - monto;
        }

        // 4. Creamos la nueva transacción DENTRO de la sesión
        const nuevaTx = new Transaccion({
        cuentaId: cuenta._id,
        monto,
        tipo,
        descripcion,
        fecha: new Date(),
        });
        await nuevaTx.save({ session });

        // 5. Actualizamos el saldo de la cuenta DENTRO de la sesión
        cuenta.saldo = nuevoSaldo;
        await cuenta.save({ session });

        // 6. Si todo fue bien, "cometemos" los cambios
        await session.commitTransaction();

        res.status(201).json({
        mensaje: "Transacción realizada con éxito",
        transaccion: nuevaTx,
        nuevoSaldo: cuenta.saldo,
        });
    } catch (error) {
        // 7. Si algo falló, hacemos "rollback"
        await session.abortTransaction();
        res
        .status(500)
        .json({ 
          mensaje: "Error al crear la transacción", 
          error: error instanceof Error ? error.message : String(error) 
        });
    } finally {
        // 8. Cerramos la sesión
        session.endSession();
    }
};


