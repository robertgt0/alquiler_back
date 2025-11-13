import mongoose from 'mongoose';
import dotenv from 'dotenv';

// 1. CORRECCIÓN DE RUTA:
// La ruta NO debe terminar en .ts
import Category from '../models/Category.model';
import { categoriesData } from '../data/categories.data';

// Cargar variables de entorno
dotenv.config({ path: '.env' });

/**
 * 2. CORRECCIÓN DE ORDEN (HOISTING):
 * 'importData' se define ANTES de ser usada.
 */
const importData = async () => {
  try {
    await Category.deleteMany();
    console.log('Categorías existentes eliminadas...');

    await Category.insertMany(categoriesData);
    console.log('¡Datos de categorías importados exitosamente!');

  } catch (error) {
    console.error('Error al importar datos:', error);
    throw error;
  }
};

/**
 * 2. CORRECCIÓN DE ORDEN (HOISTING):
 * 'deleteData' se define ANTES de ser usada.
 */
const deleteData = async () => {
  try {
    await Category.deleteMany();
    console.log('Todos los datos de categorías eliminados.');
  } catch (error) {
    console.error('Error al eliminar datos:', error);
    throw error;
  }
};


/**
 * 3. CORRECCIÓN DE SINTAXIS:
 * Se cambió 'as Promise<void> =>' (incorrecto)
 * por '...: Promise<void> =>' (la sintaxis correcta de tipo de retorno)
 */
const connectAndSeed = async (operation: 'import' | 'delete'): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('No se encontró la variable MONGODB_URI en .env');
    }
    await mongoose.connect(mongoURI);
    console.log('MongoDB conectado para el Seeder...');

    // Ahora 'operation', 'importData' y 'deleteData' se encontrarán sin error.
    if (operation === 'import') {
      await importData();
    } else if (operation === 'delete') {
      await deleteData();
    }

    await mongoose.disconnect();
    console.log('Seeder desconectado de MongoDB.');
    process.exit(0);

  } catch (error) {
    console.error('Error en el script de Seeder:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};


// Lógica para ejecutar desde la línea de comandos
if (process.argv[2] === '-d') {
  console.log('Iniciando borrado de datos...');
  connectAndSeed('delete');
} else if (process.argv[2] === '-i') {
  console.log('Iniciando importación de datos...');
  connectAndSeed('import');
} else {
  console.log('Por favor, usa -i para importar datos o -d para eliminar.');
  process.exit();
}