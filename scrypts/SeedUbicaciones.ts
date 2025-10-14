import mongoose from 'mongoose';
import Ubicacion from '../src/models/Ubicacion';

const MONGODB_URI = 'mongodb+srv://blancowinder167_db_user:YrLYtrRwWcQOYZdc@cluster0.khkpx3p.mongodb.net/fixers_db?retryWrites=true&w=majority&appName=Cluster0';

const ubicacionesIniciales = [
  {
    nombre: "Plaza 14 de Septiembre",
    posicion: { lat: -17.394211, lng: -66.156376 },
    direccion: "Plaza Principal 14 de Septiembre, Cochabamba",
    tipo: "plaza"
  },
  {
    nombre: "Cristo de la Concordia",
    posicion: { lat: -17.383807, lng: -66.134948 },
    direccion: "Cerro de San Pedro, Cochabamba",
    tipo: "monumento"
  },
  {
    nombre: "Universidad Mayor de San Simón",
    posicion: { lat: -17.3933727, lng: -66.1449641 },
    direccion: "Av. Oquendo, Cochabamba",
    tipo: "universidad"
  },
  {
    nombre: "Plaza Sucre",
    posicion: { lat: -17.39224, lng: -66.14805 },
    direccion: "Plaza Sucre, Cochabamba",
    tipo: "plaza"
  },
  {
    nombre: "Estadio Félix Capriles",
    posicion: { lat: -17.379303, lng: -66.16183 },
    direccion: "Av. Libertador Bolívar, Cochabamba",
    tipo: "estadio"
  },
   {
    nombre: 'Tiquipaya',
    posicion: { lat: -17.338727, lng: -66.213081 },
    direccion: 'Plaza Principal, Tiquipaya, Cochabamba',
    tipo: 'plaza',
  },
  {
    nombre: 'Sipe Sipe',
    posicion: { lat: -17.455351, lng: -66.356415 },
    direccion: 'Cementerio de sipe sipe, Sipe Sipe , Cochabamba',
    tipo: 'plaza',
  },

];//sipesipe -17.45535096484791, -66.3564153368733

async function seedUbicaciones() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    // Limpiar ubicaciones existentes
    await Ubicacion.deleteMany({});
    console.log('✅ Ubicaciones anteriores eliminadas');
    
    // Insertar nuevas ubicaciones
    await Ubicacion.insertMany(ubicacionesIniciales);
    console.log('✅ Ubicaciones insertadas correctamente');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al insertar ubicaciones:', error);
    process.exit(1);
  }
}

seedUbicaciones();