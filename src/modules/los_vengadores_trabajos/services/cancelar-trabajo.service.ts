//src/modules/los_vengadores_trabajos/services/cancelar-trabajo.service.ts
import Trabajo from "../models/trabajo.model";
import ProveedorModel from "../models/proveedor.model";
import ClienteModel from "../models/cliente.model";
import TrabajoModel from "../models/trabajo.model";
//import { DetallesTrabajoCanceladoProveedor, DetallesTrabajoCanceladoCliente } from "../types/index";

export class DetallesTrabajo {
    static async obtenerTrabajoVistaProveedor(TrabajoId: string) {
        try {
        const trabajo = await TrabajoModel.findById(
            TrabajoId,
            {
            _id: 1,
            id_cliente: 1,
            fecha: 1,
            hora_inicio: 1,
            hora_fin: 1,
            descripcion_trabajo: 1,
            costo: 1,
            estado: 1,
            }
        ).populate<{ id_cliente: { nombre: string } }>(
            "id_cliente",
            "nombre -_id" // solo traer nombre del cliente
        );

        if (!trabajo) {
            return { mensaje: "Trabajo no encontrado" };
        }
        return {
        id: trabajo._id,
        cliente: trabajo.id_cliente.nombre,
        fecha: (() => {
            const [año, mes, día] = trabajo.fecha.split("-").map(Number);
            const fechaObj = new Date(año, mes - 1, día);
            const fechaFormateada = new Intl.DateTimeFormat("es-ES", { 
            weekday: "long", 
            day: "numeric", 
            month: "long" 
        }).format(fechaObj).replace(",", "");
        // Mayuscula la primera letra
        return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
            })(),
        horario: `${trabajo.hora_inicio} - ${trabajo.hora_fin}`,
        descripcion: trabajo.descripcion_trabajo,
        costo: trabajo.costo,
        estado: trabajo.estado,
      };
        } catch (err) {
        console.error("Error al obtener detalles del trabajo:", err);
        return { mensaje: "Error al obtener detalles del trabajo" };
        }
    }

    static async obtenerTrabajoVistaCliente(TrabajoId: string) {
        try {
        const trabajo = await TrabajoModel.findById(
            TrabajoId,
            {
            _id: 1,
            id_proveedor: 1,
            fecha: 1,
            hora_inicio: 1,
            hora_fin: 1,
            descripcion_trabajo: 1,
            costo: 1,
            estado: 1,
            }
        ).populate<{ id_proveedor: { nombre: string } }>(
            "id_proveedor",
            "nombre -_id" // solo traer nombre del cliente
        );

        if (!trabajo) {
            return { mensaje: "Trabajo no encontrado" };
        }
        return {
        id: trabajo._id,
        proveedor: trabajo.id_proveedor.nombre,
        fecha: (() => {
            const [año, mes, día] = trabajo.fecha.split("-").map(Number);
            const fechaObj = new Date(año, mes - 1, día);
            const fechaFormateada = new Intl.DateTimeFormat("es-ES", { 
            weekday: "long", 
            day: "numeric", 
            month: "long" 
        }).format(fechaObj).replace(",", "");
        // Mayuscula la primera letra
        return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
            })(),
        horario: `${trabajo.hora_inicio} - ${trabajo.hora_fin}`,
        descripcion: trabajo.descripcion_trabajo,
        costo: trabajo.costo,
        estado: trabajo.estado,
      };
        } catch (err) {
        console.error("Error al obtener detalles del trabajo:", err);
        return { mensaje: "Error al obtener detalles del trabajo" };
        }
    }
}

export class CancelacionTrabajo {
  static async cancelarTrabajoProveedor(trabajoId: string, justificacion: string) {
    const trabajo = await TrabajoModel.findById(trabajoId)
   .populate<{ id_proveedor: { nombre: string } }>("id_proveedor", "nombre -_id");

    if (!trabajo) return null;

    trabajo.estado = "Cancelado";
    trabajo.justificacion_cancelacion = justificacion;
    trabajo.cancelado_por = "Cancelado por " + trabajo.id_proveedor.nombre;

    await trabajo.save();
    return trabajo;
  }

    static async cancelarTrabajoCliente(trabajoId: string, justificacion: string) {
    const trabajo = await TrabajoModel.findById(trabajoId)
   .populate<{ id_cliente: { nombre: string } }>("id_cliente", "nombre -_id");

    if (!trabajo) return null;

    trabajo.estado = "Cancelado";
    trabajo.justificacion_cancelacion = justificacion;
    trabajo.cancelado_por = "Cancelado por " + trabajo.id_cliente.nombre;

    await trabajo.save();
    return trabajo;
  }

}

export class TerminarTrabajo {
  static async marcarComoTerminado(trabajoId: string) {
    const trabajo = await TrabajoModel.findById(trabajoId);

    if (!trabajo) return null;

    trabajo.estado = "Terminado"; // cambia solo el estado

    await trabajo.save();
    return trabajo;
  }
}