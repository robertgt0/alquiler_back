import mongoose from 'mongoose'; // Importa Mongoose, la librería para conectarse y trabajar con MongoDB

// Función asíncrona para conectar la base de datos
const connectDB = async (): Promise<void> => {
  try {
    // Intenta conectarse a MongoDB usando la variable de entorno MONGO_URI
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    // Si la conexión es exitosa, muestra en consola el host al que se conectó
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Si ocurre un error durante la conexión, lo muestra en consola
    console.error('❌ MongoDB connection error:', error);
    // Finaliza el proceso con un código de error (1 indica fallo)
    process.exit(1);
  }
};

// Exporta la función para que pueda ser usada en otros archivos (por ejemplo, index.ts o app.ts)
export default connectDB;


