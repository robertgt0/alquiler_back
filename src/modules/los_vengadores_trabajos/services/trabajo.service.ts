import TrabajoModel from "../models/trabajo.model";
import ClienteModel from "../models/cliente.model";
import ProveedorModel from "../models/proveedor.model";

export const crearTrabajo = async (data: any) => {
  const cliente = await ClienteModel.findById(data.id_cliente);
  const proveedor = await ProveedorModel.findById(data.id_proveedor);

  if (!cliente) throw new Error("El cliente no existe");
  if (!proveedor) throw new Error("El proveedor no existe");

  // Evitar trabajos duplicados el mismo día
  const existeTrabajo = await TrabajoModel.findOne({
    id_cliente: data.id_cliente,
    id_proveedor: data.id_proveedor,
    fecha: data.fecha
  });
  if (existeTrabajo) throw new Error("Ya existe un trabajo entre este cliente y proveedor en esa fecha");

  const nuevoTrabajo = new TrabajoModel(data);
  return await nuevoTrabajo.save();
};

export const obtenerTrabajos = async () => {
  return await TrabajoModel.find()
    .populate("id_cliente", "nombre email")
    .populate("id_proveedor", "nombre email")
    .sort({ createdAt: -1 });
};

// Obtener un trabajo por ID
export const obtenerTrabajoPorId = async (id: string) => {
  return await TrabajoModel.findById(id)
    .populate("id_cliente", "nombre email")
    .populate("id_proveedor", "nombre email");
};

// Eliminar un trabajo
export const eliminarTrabajo = async (id: string) => {
  return await TrabajoModel.findByIdAndDelete(id);
};
