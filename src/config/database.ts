import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://blancowinder167_db_user:YrLYtrRwWcQOYZdc@cluster0.khkpx3p.mongodb.net/fixers_db?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async (): Promise<void> => {
  try {
    console.log('🔄 Conectando a MongoDB...');
    
    // Configuración optimizada para Atlas
    const options = {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    };

    await mongoose.connect(MONGODB_URI, options);
    
    console.log('✅ MongoDB conectado exitosamente');
    
  } catch (error) {
    console.error('❌ Error de conexión MongoDB:', error);
    console.log('🔧 SOLUCIÓN: Ve a https://cloud.mongodb.com → Network Access → Add IP Address → Allow access from anywhere');
    process.exit(1);
  }
};

export default connectDB;