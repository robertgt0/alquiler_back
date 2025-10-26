import mongoose from 'mongoose';
import { config } from 'dotenv';
import { Db } from 'mongodb';

// Cargar variables de entorno
config();

// Función para generar una descripción más detallada
function generateDetailedDescription(usuario: any): string {
    const nombre = usuario.nombre || 'Profesional';
    const especialidades = usuario.especialidades || [];
    const ciudad = usuario.ciudad?.nombre || 'su zona';
    const experiencia = Math.floor(Math.random() * 15) + 5; // Entre 5 y 20 años
    
    // Lista de frases para variar las descripciones
    const intros = [
        `${nombre} es un experto profesional con más de ${experiencia} años de experiencia`,
        `Con una trayectoria de ${experiencia} años en el sector, ${nombre} se ha convertido en referente`,
        `${nombre} lleva ${experiencia} años brindando servicios de alta calidad`
    ];

    const especialidadesTexto = especialidades.length > 0 
        ? `especializándose en ${especialidades.map((e: any) => e.nombre).join(', ')}` 
        : 'ofreciendo diversos servicios profesionales';

    const ubicacion = `Actualmente presta sus servicios en ${ciudad}`;

    const cualidades = [
        'se destaca por su compromiso con la excelencia y atención al detalle',
        'es reconocido por su profesionalismo y puntualidad',
        'garantiza un trabajo de calidad y satisfacción del cliente'
    ];

    const cierre = [
        'Siempre busca superar las expectativas de sus clientes.',
        'Cada proyecto es abordado con dedicación y profesionalismo.',
        'Su experiencia y conocimiento aseguran resultados excepcionales.'
    ];

    // Seleccionar aleatoriamente una frase de cada categoría
    const intro = intros[Math.floor(Math.random() * intros.length)];
    const cualidad = cualidades[Math.floor(Math.random() * cualidades.length)];
    const cierreText = cierre[Math.floor(Math.random() * cierre.length)];

    // Construir la descripción completa
    return `${intro}, ${especialidadesTexto}. ${ubicacion} y ${cualidad}. ${cierreText}`;
}

async function updateDescriptions() {
    try {
        // Conectar a MongoDB usando mongoose
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('✅ Conectado a MongoDB');

        // Obtener la colección de usuarios
        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('No se pudo obtener la base de datos');
        }
        const usuariosCollection = db.collection('usuarios');

        // Obtener todos los usuarios
        const usuarios = await usuariosCollection.find({}).toArray();
        console.log(`Encontrados ${usuarios.length} usuarios totales.`);

        let actualizados = 0;

        // Actualizar cada usuario con una nueva descripción
        for (const usuario of usuarios) {
            const nuevaDescripcion = generateDetailedDescription(usuario);
            await usuariosCollection.updateOne(
                { _id: usuario._id },
                { $set: { descripcion: nuevaDescripcion } }
            );
            actualizados++;
        }

        console.log(`Actualizadas ${actualizados} descripciones con éxito.`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

updateDescriptions();