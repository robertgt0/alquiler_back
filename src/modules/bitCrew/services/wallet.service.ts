
import mongoose from "mongoose";
import BilleteraModel from "../models/wallet"; // Ruta relativa al módulo

import { IBilletera } from '../types/wallet.types'; 

export const getBilleteraByFixerId = async (fixerId: mongoose.Types.ObjectId): Promise<IBilletera | null> => {
  try {
    const billetera = await BilleteraModel.findOne({ fixer_id: fixerId });
    return billetera;
  } catch (error) {
    console.error('Error en servicio - getBilleteraByFixerId:', error);
    throw new Error('Error al buscar billetera por ID de fixer');
  }
};
