import FixerModel from "../models/Fixer"; 
// Importa desde la carpeta 'types' DENTRO del módulo 'bitCrew'
import { IFixer } from '../types/index'; 
/**
 * Obtiene todos los fixers de la base de datos.
 */
export const getAllFixers = async (): Promise<IFixer[]> => {
  try {
    const todosLosFixers = await FixerModel.find();
    return todosLosFixers;
  } catch (error) {
    console.error('Error en servicio - getAllFixers:', error);
    throw new Error('Error al obtener fixers');
  }
};

/**
 * Busca un fixer por su nombre de usuario.
 */
export const getFixerByUsuario = async (usuario: string): Promise<IFixer | null> => {
  try {
    const fixer = await FixerModel.findOne({ usuario: usuario });
    return fixer;
  } catch (error) {
    console.error('Error en servicio - getFixerByUsuario:', error);
    throw new Error('Error al buscar fixer por usuario');
  }
};