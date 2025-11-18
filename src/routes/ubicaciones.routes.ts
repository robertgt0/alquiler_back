import { Router, Request, Response } from "express";

const router = Router();

// Ruta para obtener ubicaciones
router.get("/", async (req: Request, res: Response) => {
  try {
    console.log('📍 Solicitud de ubicaciones recibida');
    
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

// Ruta para obtener una ubicación específica por ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`📍 Solicitud de ubicación ID: ${id}`);
    
    const ubicacionEjemplo = {
      id: parseInt(id),
      posicion: {
        lat: -17.7833 + (Math.random() * 0.02 - 0.01),
        lng: -63.1821 + (Math.random() * 0.02 - 0.01)
      },
      nombre: `Ubicación ${id}`,
      direccion: `Dirección ejemplo para ubicación ${id}`,
      tipo: ['comercial', 'residencial', 'turístico'][Math.floor(Math.random() * 3)],
      rating: 3.5 + (Math.random() * 1.5)
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

export default router;