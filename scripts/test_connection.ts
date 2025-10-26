import mongoose from 'mongoose';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

async function testConnection() {
    try {
        // Intentar conectarse a MongoDB
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('✅ Conexión exitosa a MongoDB');
        
        // Esperar a que la conexión esté lista
        await mongoose.connection.asPromise();
        
        // Intentar una operación simple
        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('No se pudo obtener la referencia a la base de datos');
        }
        
        const usuarios = await db.collection('usuarios').find({}).limit(1).toArray();
        console.log(`✅ Prueba de lectura exitosa. Encontrado ${usuarios.length} usuario(s).`);
        
        // Mostrar un usuario de ejemplo
        if (usuarios.length > 0) {
            const usuario = usuarios[0];
            console.log('📝 Ejemplo de usuario:', {
                id: usuario._id,
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                descripcion: usuario.descripcion?.substring(0, 100) + '...'
            });
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error al conectar:', error);
        process.exit(1);
    }
}

testConnection();