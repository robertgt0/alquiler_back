import TrabajoModel from "../models/trabajo.model";
import ClienteModel from "../models/cliente.model";
import ProveedorModel from "../models/proveedor.model";

export const crearTrabajo = async (data: any) => {
  const cliente = await ClienteModel.findById(data.id_cliente);
  const proveedor = await ProveedorModel.findById(data.id_proveedor);

  if (!cliente) throw new Error("El cliente no existe");
  if (!proveedor) throw new Error("El proveedor no existe");

<<<<<<< HEAD
// 2. coleccion de Clientes (datos simulados)
const mockClientes = [
  { _id: "cliente_abc", nombre: "Ana Garcia" },
  { _id: "cliente_def", nombre: "Carlos Mendez" },
  { _id: "cliente_ghi", nombre: "Elena Vargas" },
];

// 3. coleccion de Trabajos Solicitados (datos simulados)
const mockTrabajosSolicitados: ITrabajoSolicitado[] = [
  { _id: "trabajo_xyz", id_proveedor: "proveedor_123", id_cliente: "cliente_abc", fecha: "25/9/25", horaInicio: "08:00", horaFin: "10:00", estado: "Pendiente" },
  { _id: "trabajo_uvw", id_proveedor: "proveedor_123", id_cliente: "cliente_def", fecha: "27/9/25", horaInicio: "15:00", horaFin: "17:00", estado: "Pendiente" },
  { _id: "trabajo_rst", id_proveedor: "proveedor_456", id_cliente: "cliente_abc", fecha: "28/9/25", horaInicio: "11:00", horaFin: "13:00", estado: "Pendiente" },
  { _id: "trabajo_pqr", id_proveedor: "proveedor_123", id_cliente: "cliente_ghi", fecha: "27/9/25", horaInicio: "15:00", horaFin: "17:00", estado: "Pendiente" },
  { _id: "trabajo_lmn", id_proveedor: "proveedor_789", id_cliente: "cliente_abc", fecha: "30/9/25", horaInicio: "09:00", horaFin: "11:00", estado: "Pendiente" },
];

// --- SERVICIOS ACTUALIZADOS CON LOGICA DE UNION ---

// Lógica para obtener trabajos de un PROVEEDOR
export const getTrabajosProveedorService = async (proveedorId: string, estado?: string): Promise<ITrabajoCompleto[]> => {
  // 1. Filtramos los trabajos por el ID del proveedor y opcionalmente por estado
  let trabajosFiltrados = mockTrabajosSolicitados.filter(t => t.id_proveedor === proveedorId);
  if (estado) {
    trabajosFiltrados = trabajosFiltrados.filter(t => t.estado === estado);
  }

  // 2. unimos los datos: para cada trabajo, buscamos la info del cliente y proveedor
  const trabajosCompletos = trabajosFiltrados.map(trabajo => {
    const proveedorInfo = mockProveedores.find(p => p._id === trabajo.id_proveedor)!;
    const clienteInfo = mockClientes.find(c => c._id === trabajo.id_cliente)!;

    return {
      _id: trabajo._id,
      proveedor: { id: proveedorInfo._id, nombre: proveedorInfo.nombre },
      cliente: { id: clienteInfo._id, nombre: clienteInfo.nombre },
      fecha: trabajo.fecha,
      horaInicio: trabajo.horaInicio,
      horaFin: trabajo.horaFin,
      servicio: proveedorInfo.profesion, // usamos la profesion como el servicio
      estado: trabajo.estado
    };
=======
  // Evitar trabajos duplicados el mismo día
  const existeTrabajo = await TrabajoModel.findOne({
    id_cliente: data.id_cliente,
    id_proveedor: data.id_proveedor,
    fecha: data.fecha
>>>>>>> 34ec0f82b309f8187f1ec70c35f8ba0c12c8006e
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
