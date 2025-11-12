import { Cliente, ICliente } from "@models/cliente.model";

export const createCliente = async (data: Partial<ICliente>): Promise<ICliente> => {
  const cliente = new Cliente(data);
  return await cliente.save();
};

export const getClientes = async (): Promise<ICliente[]> => {
  return await Cliente.find();
};

export const getClienteById = async (id: string): Promise<ICliente | null> => {
  return await Cliente.findById(id);
};

export const updateCliente = async (id: string, data: Partial<ICliente>): Promise<ICliente | null> => {
  return await Cliente.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCliente = async (id: string): Promise<ICliente | null> => {
  return await Cliente.findByIdAndDelete(id);
};
