// Importamos las dependencias principales de Express y configuración del servidor
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importamos la función para conectar la base de datos
import connectDB from './config/database';

// Importamos las rutas de búsqueda (donde están los endpoints)
import paginationRouter from './modules/borbotones/routes/pagination.router';

import ordenamientoRouter from './modules/borbotones/routes/ordering.routes';

import busquedaRouter from './modules/borbotones/routes/busqueda.router';

// 🔹 Carga las variables de entorno desde el archivo .env
dotenv.config();

// 🔹 Crea la aplicación Express
const app = express();

// 🔹 Conecta a la base de datos MongoDB Atlas usando la función connectDB()
connectDB();

// 🔹 Middlewares globales
app.use(cors()); // Permite que el frontend (React, Next.js, etc.) se comunique con el backend sin errores CORS
app.use(express.json()); // Permite recibir datos JSON en las peticiones POST/PUT
app.use(express.urlencoded({ extended: true })); // Permite recibir datos codificados en formularios

// 🔹 Ruta raíz para verificar que el backend está funcionando correctamente
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'API Backend',
    status: 'OK',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    modules: ['/api/busqueda'] // Módulos disponibles
  });
});

// 🔹 Ruta principal de tu módulo de búsqueda
// Ejemplo de endpoint: http://localhost:5000/api/busqueda?termino=ele
app.use('/api/busqueda', busquedaRouter);
app.use('/api/borbotones', paginationRouter); //Historia de usuario P01
app.use('/api/borbotones', ordenamientoRouter);//Historia de O01


// 🔹 Middleware para rutas no encontradas (manejo de errores 404)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.path
  });
});

// 🔹 Configura el puerto del servidor (desde .env o por defecto 5000)
const PORT = process.env.PORT || 5000;

// 🔹 Inicia el servidor y muestra datos útiles en consola
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`⚙️  Modo: ${process.env.NODE_ENV || 'development'}`);
});
