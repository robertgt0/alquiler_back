import Fixer from '../models/Fixer';
import Oferta from '../models/Oferta';
import { CreateFixerDTO, CreateOfertaDTO, UpdateOfertaDTO } from '../types';

class FixerService {
  // HU05: Registrar un nuevo Fixer
  async createFixer(data: CreateFixerDTO) {
    try {
      // Validar que el CI no exista (HU01)
      const existingFixerByCI = await Fixer.findOne({ ci: data.ci });
      if (existingFixerByCI) {
        throw new Error('Este C.I. ya se encuentra registrado');
      }

      // Validar que el usuario no sea ya Fixer
      const existingFixerByUser = await Fixer.findOne({ userId: data.userId });
      if (existingFixerByUser) {
        throw new Error('Este usuario ya es un Fixer');
      }

      // Validar que aceptó términos y condiciones (HU05)
      if (!data.terminosAceptados) {
        throw new Error('Debe aceptar los términos y condiciones');
      }

      // Validar método de pago
      const { efectivo, qr, tarjeta } = data.metodoPago;
      if (!efectivo && !qr && !tarjeta) {
        throw new Error('Debe seleccionar al menos un método de pago');
      }

      // Si eligió QR o tarjeta, validar cuenta bancaria
      if ((qr || tarjeta) && !data.cuentaBancaria) {
        throw new Error(
          'Debe registrar una cuenta bancaria para pagos QR/Tarjeta'
        );
      }

      // Crear el Fixer
      const newFixer = new Fixer(data);
      await newFixer.save();

      return newFixer;
    } catch (error: any) {
      throw new Error(`Error al crear Fixer: ${error.message}`);
    }
  }

  // Obtener Fixer por userId
  async getFixerByUserId(userId: string) {
    try {
      const fixer = await Fixer.findOne({ userId });
      return fixer;
    } catch (error: any) {
      throw new Error(`Error al buscar Fixer: ${error.message}`);
    }
  }

  // Obtener Fixer por CI
  async getFixerByCI(ci: string) {
    try {
      const fixer = await Fixer.findOne({ ci });
      return fixer;
    } catch (error: any) {
      throw new Error(`Error al buscar Fixer por CI: ${error.message}`);
    }
  }

  // HU06: Crear una oferta de trabajo
  async createOferta(data: CreateOfertaDTO) {
    try {
      // Validar que el Fixer existe
      const fixer = await Fixer.findById(data.fixerId);
      if (!fixer) {
        throw new Error('Fixer no encontrado');
      }

      // Validar descripción (HU06)
      if (!data.descripcion || data.descripcion.length > 100) {
        throw new Error('La descripción debe tener máximo 100 caracteres');
      }

      // Validar categorías
      if (!data.categorias || data.categorias.length === 0) {
        throw new Error('Debe seleccionar al menos una categoría');
      }

      // Validar imágenes (máximo 5)
      if (data.imagenes && data.imagenes.length > 5) {
        throw new Error('No se permiten más de 5 imágenes por oferta');
      }

      // Crear la oferta
      const newOferta = new Oferta(data);
      await newOferta.save();

      return newOferta;
    } catch (error: any) {
      throw new Error(`Error al crear oferta: ${error.message}`);
    }
  }

  // HU07: Editar una oferta
  async updateOferta(ofertaId: string, data: UpdateOfertaDTO) {
    try {
      const oferta = await Oferta.findById(ofertaId);
      if (!oferta) {
        throw new Error('Oferta no encontrada');
      }

      // Validar descripción si se actualiza
      if (data.descripcion && data.descripcion.length > 100) {
        throw new Error('La descripción debe tener máximo 100 caracteres');
      }

      // Validar imágenes si se actualizan
      if (data.imagenes && data.imagenes.length > 5) {
        throw new Error('No se permiten más de 5 imágenes por oferta');
      }

      // Actualizar campos
      Object.assign(oferta, data);
      oferta.fechaEdicion = new Date();
      await oferta.save();

      return oferta;
    } catch (error: any) {
      throw new Error(`Error al editar oferta: ${error.message}`);
    }
  }

  // HU08: Eliminar una oferta
  async deleteOferta(ofertaId: string) {
    try {
      const oferta = await Oferta.findByIdAndDelete(ofertaId);
      if (!oferta) {
        throw new Error('Oferta no encontrada');
      }

      return { message: 'Oferta eliminada con éxito' };
    } catch (error: any) {
      throw new Error(`Error al eliminar oferta: ${error.message}`);
    }
  }

  // HU09: Obtener todas las ofertas de un Fixer
  async getOfertasByFixer(fixerId: string) {
    try {
      const ofertas = await Oferta.find({ fixerId, activa: true }).sort({
        fechaPublicacion: -1,
      }); // Más recientes primero (HU09)

      return ofertas;
    } catch (error: any) {
      throw new Error(`Error al obtener ofertas: ${error.message}`);
    }
  }

  // HU10: Obtener detalle de una oferta
  async getOfertaById(ofertaId: string) {
    try {
      const oferta = await Oferta.findById(ofertaId).populate('fixerId');
      if (!oferta) {
        throw new Error('Oferta no encontrada');
      }

      return oferta;
    } catch (error: any) {
      throw new Error(`Error al obtener oferta: ${error.message}`);
    }
  }

  // HU09: Obtener todas las ofertas (para listado público)
  async getAllOfertas() {
    try {
      const ofertas = await Oferta.find({ activa: true })
        .populate('fixerId')
        .sort({ fechaPublicacion: -1 });

      return ofertas;
    } catch (error: any) {
      throw new Error(`Error al obtener ofertas: ${error.message}`);
    }
  }
}

export default new FixerService();