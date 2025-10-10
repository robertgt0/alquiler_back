import mongoose from 'mongoose';
import Fixer from '../src/models/Fixer';
import { fixersDefinidos } from '../src/data/fixersData';

const MONGODB_URI = 'mongodb+srv://blancowinder167_db_user:YrLYtrRwWcQOYZdc@cluster0.khkpx3p.mongodb.net/fixers_db?retryWrites=true&w=majority&appName=Cluster0';

async function seedFixers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar fixers existentes
    const deleteResult = await Fixer.deleteMany({});
    console.log(`🗑️ Eliminados ${deleteResult.deletedCount} fixers anteriores`);

    // Insertar nuevos fixers
    const insertResult = await Fixer.insertMany(fixersDefinidos);
    console.log(`✅ Insertados ${insertResult.length} fixers correctamente`);

    // Mostrar resumen
    console.log('\n📊 RESUMEN DE FIXERS CARGADOS:');
    insertResult.forEach((fixer, index) => {
      console.log(`   ${index + 1}. ${fixer.nombre} - ${fixer.especialidad}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al insertar fixers:', error);
    process.exit(1);
  }
}

seedFixers();