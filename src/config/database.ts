import mongoose from 'mongoose';
import dotenv from 'dotenv';

// 🔹 Cargar .env antes de usar cualquier variable
dotenv.config();

const connectDB = async (): Promise<void> => {
  const MONGO_URI = process.env.MONGODB_URI;

  if (!MONGO_URI) {
    throw new Error('MONGODB_URI no está definido en el .env');
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB conectado exitosamente');
  } catch (error) {
    console.error('❌ Error al conectar MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;