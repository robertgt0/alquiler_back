/// <reference path="./global.d.ts" />
import mongoose from 'mongoose';

beforeAll(async () => {
  // Solo conectar a BD en tests si no está ya conectado
  if (mongoose.connection.readyState === 0) {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
    await mongoose.connect(mongoUri);
  }
});

afterAll(async () => {
  try {
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
});


