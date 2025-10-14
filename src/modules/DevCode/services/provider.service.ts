import connectDB from "@/config/database";
import mongoose from "mongoose";
import usuario from "../models/usuario";
import Appointment from "../models/Appointment";
import Providder from "../models/Providder";
export  const getUsuariosSinModelo = async () => {
    try {
        await connectDB();
        const usuarios = await usuario.find().select("-password -__v");
        return [usuarios ]


    } catch (error) {
        console.error(error)
    }finally{
        await mongoose.disconnect();
    }
}


export const getProviderById = async ( id:string ) => {

  await connectDB();

  // Obtener el proveedor con info pública del usuario
  const provider = await Providder.findById(id)
    .populate("user", "name lastName")
    .select("-__v");

  if (!provider) {
    // En Express lanzamos un error o devolvemos un objeto
    const error = new Error("Proveedor no encontrado");
    (error as any).status = 404;
    throw error;
  }

  // Obtener citas futuras pendientes del proveedor
  const citas = await Appointment.find({ proveedor: id, estado: "pendiente" })
    .populate("cliente", "name lastName")
    .select("-__v -notas");

  return { provider, citas };

};