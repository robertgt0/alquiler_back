import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import mongoose from 'mongoose';

// Cargar variables de entorno
config();

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Ruta simple para probar
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Ruta de departamentos
app.get('/api/borbotones/filtros/departamentos', (req, res) => {
  const departamentos = [
    "Beni",
    "Chuquisaca",
    "Cochabamba",
    "La Paz",
    "Oruro",
    "Pando",
    "Potosí",
    "Santa Cruz",
    "Tarija"
  ];
  res.json({ success: true, data: departamentos });
});

// Conexión a MongoDB y arranque del servidor
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/alquiler_db';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  });