// Importamos el Router de Express, que nos permite definir rutas para nuestra API
import { Router } from 'express';

// Importamos la función getBusqueda desde el controlador de búsqueda
import { getBusqueda } from '../controllers/busqueda.controller';

// Importamos los controladores relacionados con el historial de búsqueda
import { getHistorial, limpiarHistorial } from '../controllers/historial.controller';

// Importamos el servicio que gestiona la lógica del historial (guardar, listar, limpiar)
import { HistorialService } from '../services/historial.service';

// Creamos una nueva instancia del router de Express
const router = Router();

/* 
  Middleware: guardarEnHistorial
  Este middleware intercepta la respuesta (res.json) y agrega una acción adicional:
  si la búsqueda fue exitosa y devolvió resultados, se guarda el término buscado en el historial.
*/
const guardarEnHistorial = (req: any, res: any, next: any) => {
  // Guardamos la función original res.json de Express
  const originalJson = res.json;

  // Sobrescribimos res.json temporalmente para interceptar la respuesta
  res.json = function (data: any) {
    // Si la respuesta indica éxito y tiene resultados, guardamos la búsqueda
    if (data.success && data.resultados && data.resultados.length > 0) {
      // Llamamos al servicio para guardar el término buscado en el historial
      HistorialService.guardarBusqueda(req, data.terminoOriginal || req.query.q);
    }
    // Llamamos a la función original para enviar la respuesta al cliente
    originalJson.call(this, data);
  };

  // Continuamos con el siguiente middleware o controlador
  next();
};

// Ruta principal de búsqueda
// Cuando se hace GET a '/', primero pasa por guardarEnHistorial y luego ejecuta getBusqueda

router.get('/', guardarEnHistorial, getBusqueda);

// Ruta para obtener el historial de búsquedas almacenado

router.get('/historial', getHistorial);

// Ruta para eliminar (limpiar) todo el historial de búsquedas

router.delete('/historial', limpiarHistorial);

// Exportamos el router para poder usarlo en app.ts o index.ts
export default router;
