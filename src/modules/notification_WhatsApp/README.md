# Módulo: nombre_grupo_ejemplo

## 📋 Descripción
Este es un módulo de ejemplo que muestra la estructura que debe seguir cada grupo/módulo del proyecto.

## 📁 Estructura del Módulo

```
nombre_grupo_ejemplo/
├── index.ts              # Punto de entrada, monta las rutas del módulo
├── config/               # Configuración específica del módulo
│   └── module.config.ts
├── controllers/          # Controladores (manejo de request/response)
│   └── ejemplo.controller.ts
├── routes/               # Definición de rutas/endpoints
│   └── ejemplo.routes.ts
├── services/             # Lógica de negocio
│   └── ejemplo.service.ts
├── models/               # Modelos de Mongoose
│   └── Ejemplo.ts
├── middlewares/          # Middlewares específicos del módulo
│   └── validate.middleware.ts
├── types/                # Tipos e interfaces de TypeScript
│   └── index.ts
├── utils/                # Funciones auxiliares
│   └── helpers.ts
├── errors/               # Manejo de errores
│   └── errorHandler.ts
└── README.md             # Documentación del módulo
```

## 🔗 Endpoints

### Ejemplo
- `GET /api/nombre_grupo_ejemplo/ejemplo` - Obtener todos
- `GET /api/nombre_grupo_ejemplo/ejemplo/:id` - Obtener por ID
- `POST /api/nombre_grupo_ejemplo/ejemplo` - Crear nuevo
- `PUT /api/nombre_grupo_ejemplo/ejemplo/:id` - Actualizar
- `DELETE /api/nombre_grupo_ejemplo/ejemplo/:id` - Eliminar

## 🚀 Cómo crear un nuevo módulo

1. **Duplica esta carpeta** y renómbrala con el nombre de tu módulo
2. **Actualiza el archivo `index.ts`** con tus rutas
3. **Crea tus modelos** en la carpeta `models/`
4. **Implementa la lógica** en `services/`
5. **Crea los controladores** en `controllers/`
6. **Define las rutas** en `routes/`
7. **Importa y monta** el módulo en `src/index.ts`:
   ```typescript
   import tuModuloRouter from './modules/tu_modulo';
   app.use('/api/tu_modulo', tuModuloRouter);
   ```

## 📝 Flujo de una petición

```
Cliente
  ↓
src/index.ts (monta el módulo)
  ↓
modules/nombre_grupo_ejemplo/index.ts (router principal)
  ↓
modules/nombre_grupo_ejemplo/routes/ejemplo.routes.ts
  ↓
modules/nombre_grupo_ejemplo/middlewares/validate.middleware.ts (opcional)
  ↓
modules/nombre_grupo_ejemplo/controllers/ejemplo.controller.ts
  ↓
modules/nombre_grupo_ejemplo/services/ejemplo.service.ts (lógica de negocio)
  ↓
modules/nombre_grupo_ejemplo/models/Ejemplo.ts (MongoDB)
```

## ⚠️ Importante

- **Cada módulo es independiente** y maneja su propia lógica
- **No hay carpetas globales** de controllers, routes o models
- **Cada equipo trabaja en su propio módulo** sin afectar a otros
- **Los módulos se montan** en `src/index.ts`

## 💡 Tips

- Usa nombres descriptivos para tus archivos
- Mantén la estructura consistente entre módulos
- Documenta tus endpoints en este README
- Usa TypeScript para mejor autocompletado y menos errores
- Implementa validaciones en los middlewares
- Maneja los errores de forma consistente