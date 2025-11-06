import { Cuenta, ICuenta } from "@/models/cuenta.model";

export const createCuenta = async (data: Partial<ICuenta>): Promise<ICuenta> => {
  const cuenta = new Cuenta(data);
  return await cuenta.save();
}

export const getCuentas = async (): Promise<ICuenta[]> => {
  return await Cuenta.find().populate("propietario");
}

export const getCuentaById = async (id: string): Promise<ICuenta | null> => {
  return await Cuenta.findById(id).populate("propietario");
}

export const updateCuenta = async (id: string, data: Partial<ICuenta>): Promise<ICuenta | null> => {
  return await Cuenta.findByIdAndUpdate(id, data, { new: true });
}

export const deleteCuenta = async (id: string): Promise<ICuenta | null> => {
  return await Cuenta.findByIdAndDelete(id);
}   
