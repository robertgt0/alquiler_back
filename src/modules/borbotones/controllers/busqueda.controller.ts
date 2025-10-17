import { Request, Response } from 'express';
import Especialidad from '../models/Especialidad';

/**
 * 🔹 Función auxiliar: normalizarTexto
 * Elimina acentos y convierte el texto a minúsculas.
 * Esto permite hacer búsquedas insensibles a mayúsculas y acentos.
 * Ejemplo: "Eléctrico" -> "electrico"
 */
const normalizarTexto = (texto: string): string =>
  texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/**
 * 🔹 Función auxiliar: validarCaracteres
 * Permite solo letras (con o sin acentos), espacios, comas y guiones.
 * Evita que se busquen cosas como símbolos, números o caracteres extraños.
 */
const validarCaracteres = (texto: string): boolean => {
  const permitidos = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ´\s,-]+$/;
  return permitidos.test(texto);
};

/**
 * ✅ Controlador principal: getBusqueda
 * 
 * Este controlador recibe una búsqueda del frontend y devuelve coincidencias.
 * 
 * 📍 Endpoint esperado en el backend:
 *    GET /api/borbotones/busqueda?q=<termino>
 * 
 * 🔁 Flujo:
 *  1. Recibe el parámetro `q` desde la URL (?q=plomero)
 *  2. Valida que el texto sea correcto (no vacío, sin caracteres raros, etc.)
 *  3. Normaliza el texto (sin acentos, minúsculas)
 *  4. Busca coincidencias en la colección "Especialidad"
 *  5. Devuelve las coincidencias como un array de strings
 * 
 * 🔸 Ejemplo de petición desde el frontend:
 * fetch("http://localhost:5000/api/borbotones/busqueda?q=elec")
 *   .then(res => res.json())
 *   .then(data => console.log(data));
 */
export const getBusqueda = async (req: Request, res: Response) => {
  try {
    // 1️⃣ Extraer el parámetro de búsqueda de la URL
    const { q } = req.query;

    // Validar que exista y sea un string
    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar un parámetro de búsqueda válido.'
      });
    }

    // 2️⃣ Limpiar espacios múltiples y recortar el texto
    const textoLimpio = q.replace(/\s+/g, ' ').trim();

    // 3️⃣ Normalizar texto para comparación sin acentos
    const texto = normalizarTexto(textoLimpio);

    // 4️⃣ Validaciones adicionales
    if (textoLimpio.length === 0 || texto.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Ingrese un término de búsqueda válido.'
      });
    }

    if (textoLimpio.length > 80) {
      return res.status(400).json({
        success: false,
        message: 'Máximo 80 caracteres permitidos.'
      });
    }

    if (!validarCaracteres(textoLimpio)) {
      return res.status(400).json({
        success: false,
        message: 'Solo se permiten caracteres alfabéticos y: ´ , -'
      });
    }

    if (texto.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Debe ingresar al menos 2 caracteres para buscar.'
      });
    }

    // 5️⃣ Buscar coincidencias en la colección "Especialidad"
    // Se usa una expresión regular (regex) para coincidencias parciales e insensibles a mayúsculas
    const resultados = await Especialidad.find({
      nombre: { $regex: texto, $options: 'i' }
    }).limit(5); // Limitar a 5 resultados

    // 6️⃣ Devolver respuesta exitosa al frontend
    return res.status(200).json({
      success: true,
      resultados: resultados.map(e => e.nombre), // Solo se envían los nombres
      terminoOriginal: q // Se devuelve el término original para mostrarlo al usuario
    });

  } catch (error) {
    // 7️⃣ Manejo de errores generales
    console.error('❌ Error en la búsqueda:', error);
    res.status(500).json({
      success: false,
      message: 'Error al realizar la búsqueda. Intenta de nuevo.'
    });
  }
};
