import { Router } from "express";

const router = Router();

// Ruta para obtener ubicaciones - ESTRUCTURA CORREGIDA
router.get("/", async (req, res) => {
  try {
    console.log('📍 Solicitud de ubicaciones recibida');
    
    // ✅ ESTRUCTURA CORREGIDA: usar "posicion" en lugar de lat/lng directos
    const ubicacionesEjemplo = [
      { 
        id: 1, 
        posicion: {
          lat: -17.7833, 
          lng: -63.1821
        },
        nombre: 'Centro de Santa Cruz',
        direccion: 'Av. San Martín entre 2do y 3er anillo',
        tipo: 'comercial',
        rating: 4.5
      },
      { 
        id: 2, 
        posicion: {
          lat: -17.7933, 
          lng: -63.1921
        },
        nombre: 'Equipetrol',
        direccion: 'Av. San Martín y 4to anillo',
        tipo: 'residencial',
        rating: 4.2
      },
      { 
        id: 3, 
        posicion: {
          lat: -17.7733, 
          lng: -63.1721
        },
        nombre: 'Mercado Los Pozos',
        direccion: 'Calle Suárez Arana',
        tipo: 'comercial',
        rating: 4.0
      },
      { 
        id: 4, 
        posicion: {
          lat: -17.8033, 
          lng: -63.2021
        },
        nombre: 'Urb. Los Chacos',
        direccion: 'Zona Norte',
        tipo: 'residencial',
        rating: 4.7
      },
      { 
        id: 5, 
        posicion: {
          lat: -17.7633, 
          lng: -63.1621
        },
        nombre: 'Plaza 24 de Septiembre',
        direccion: 'Centro Histórico',
        tipo: 'turístico',
        rating: 4.8
      }
    ];

    res.json({ 
      success: true, 
      data: ubicacionesEjemplo,
      message: `${ubicacionesEjemplo.length} ubicaciones cargadas`
    });
    
  } catch (error: any) {
    console.error('❌ Error al obtener ubicaciones:', error);
    res.status(500).json({ 
      success: false, 
      message: error?.message || 'Error interno del servidor al obtener ubicaciones' 
    });
  }
});

// Ruta para obtener una ubicación específica por ID - ESTRUCTURA CORREGIDA
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📍 Solicitud de ubicación ID: ${id}`);
    
    // ✅ ESTRUCTURA CORREGIDA
    const ubicacionEjemplo = {
      id: parseInt(id),
      posicion: {
        lat: -17.7833 + (Math.random() * 0.02 - 0.01),
        lng: -63.1821 + (Math.random() * 0.02 - 0.01)
      },
      nombre: `Ubicación ${id}`,
      direccion: `Dirección ejemplo para ubicación ${id}`,
      tipo: ['comercial', 'residencial', 'turístico'][Math.floor(Math.random() * 3)],
      rating: 3.5 + (Math.random() * 1.5),
      descripcion: `Esta es una descripción de ejemplo para la ubicación ${id}`,
      servicios: ['WiFi', 'Estacionamiento', 'Aire Acondicionado'].slice(0, Math.floor(Math.random() * 3) + 1)
    };

    res.json({ 
      success: true, 
      data: ubicacionEjemplo 
    });
    
  } catch (error: any) {
    console.error(`❌ Error al obtener ubicación ${req.params.id}:`, error);
    res.status(500).json({ 
      success: false, 
      message: error?.message || 'Error interno del servidor' 
    });
  }
});

// Ruta para crear una nueva ubicación - ESTRUCTURA CORREGIDA
router.post("/", async (req, res) => {
  try {
    const { lat, lng, nombre, direccion, tipo } = req.body;
    
    console.log('📍 Creando nueva ubicación:', { lat, lng, nombre });
    
    if (!lat || !lng || !nombre) {
      return res.status(400).json({
        success: false,
        message: 'Latitud, longitud y nombre son requeridos'
      });
    }

    // ✅ ESTRUCTURA CORREGIDA
    const nuevaUbicacion = {
      id: Date.now(),
      posicion: {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      },
      nombre: nombre.toString(),
      direccion: direccion?.toString() || 'Dirección no especificada',
      tipo: tipo?.toString() || 'general',
      rating: 0,
      fechaCreacion: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      data: nuevaUbicacion,
      message: 'Ubicación creada exitosamente'
    });
    
  } catch (error: any) {
    console.error('❌ Error al crear ubicación:', error);
    res.status(500).json({ 
      success: false, 
      message: error?.message || 'Error interno del servidor al crear ubicación' 
    });
  }
});

export default router;