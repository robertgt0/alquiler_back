import { ProveedorInfo, IProveedorInfo } from "@models/proveedorInfo.model";

export const createProveedor = async (data: Partial<IProveedorInfo>): Promise<IProveedorInfo> => {
  const proveedor = new ProveedorInfo(data);
  return await proveedor.save();
};

export const getProveedores = async (): Promise<IProveedorInfo[]> => {
  return await ProveedorInfo.find().populate("usuario servicios calendario");
};

export const getProveedorById = async (id: string): Promise<IProveedorInfo | null> => {
  return await ProveedorInfo.findById(id).populate("usuario servicios calendario");
};

export const updateProveedor = async (id: string, data: Partial<IProveedorInfo>): Promise<IProveedorInfo | null> => {
  return await ProveedorInfo.findByIdAndUpdate(id, data, { new: true });
};

export const deleteProveedor = async (id: string): Promise<IProveedorInfo | null> => {
  return await ProveedorInfo.findByIdAndDelete(id);
};
