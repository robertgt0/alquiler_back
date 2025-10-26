import { getDatabase } from "../src/modules/borbotones/config/conecction";

async function main() {
  try {
  const db = await getDatabase();
  if (!db) throw new Error('No se pudo obtener la base de datos');
  const usuarios = db.collection('usuarios');

    const cursor = usuarios.find({ $or: [ { descripcion: { $exists: false } }, { descripcion: null }, { descripcion: "" } ] });
    const docs = await cursor.toArray();
    console.log(`Encontrados ${docs.length} usuarios sin descripcion.`);

    let updated = 0;
    for (const u of docs) {
      const nombre = u.nombre || 'Este profesional';
      const especialidades = Array.isArray(u.especialidades) && u.especialidades.length > 0
        ? u.especialidades.map((e: any) => e.nombre).slice(0,2).join(', ')
        : null;

      const descripcion = especialidades
        ? `${nombre} es especialista en ${especialidades}. Contacta para más detalles.`
        : `${nombre} es un profesional disponible para servicios. Contáctalo para más información.`;

      const res = await usuarios.updateOne({ _id: u._id }, { $set: { descripcion } });
      if (res.modifiedCount && res.modifiedCount > 0) updated++;
    }

    console.log(`Actualizadas ${updated} descripciones.`);
    process.exit(0);
  } catch (err) {
    console.error('Error al añadir descripciones:', err);
    process.exit(1);
  }
}

main();
