# Backend API - Arquitectura Modular

## 🏗️ Estructura del Proyecto

```
backend/
├── src/
│   ├── config/              # Configuración global (DB, etc)
│   ├── types/               # Tipos globales compartidos
│   ├── utils/               # Utilidades globales
│   ├── middlewares/         # Middlewares globales
│   ├── modules/             # Módulos/Grupos independientes
│   │   └── nombre_grupo_ejemplo/  # Ejemplo de módulo
│   │       ├── config/
│   │       ├── controllers/
│   │       ├── routes/
│   │       ├── services/
│   │       ├── middlewares/
│   │       ├── models/
│   │       ├── types/
│   │       ├── utils/
│   │       ├── errors/
│   │       └── index.ts
│   └── index.ts             # Punto de entrada principal
├── dist/                    # Código compilado
├── .env                     # Variables de entorno
├── tsconfig.json           # Configuración TypeScript
└── package.json            # Dependencias
```

## 📦 Módulos

Cada módulo es **independiente** y contiene toda su lógica:

- ✅ Sus propios controllers
- ✅ Sus propias routes
- ✅ Sus propios models
- ✅ Sus propios services
- ✅ Sus propios middlewares
- ✅ Sus propios types

### Módulos actuales:
- `nombre_grupo_ejemplo` - Módulo de ejemplo (template)

## 🚀 Cómo agregar un nuevo módulo

1. Copia la carpeta `src/modules/nombre_grupo_ejemplo`
2. Renómbrala con el nombre de tu módulo
3. Modifica los archivos según tu necesidad
4. Importa y monta en `src/index.ts`:

```typescript
import tuModuloRouter from './modules/tu_modulo';
app.use('/api/tu_modulo', tuModuloRouter);
```

## 🔧 Instalación

```bash
npm install
```

## 🏃 Ejecutar

```bash
# Desarrollo
npm run dev

# Compilar
npm run build

# Producción
npm start
```

## 📡 Endpoints base

- `GET /` - Info de la API
- `GET /api/health` - Health check

## 👥 Trabajo en equipo

Cada equipo trabaja en su propio módulo sin interferir con otros:

- **Equipo A** → `modules/modulo_a/`
- **Equipo B** → `modules/modulo_b/`
- **Equipo C** → `modules/modulo_c/`

Una vez terminado, cada equipo monta su módulo en `src/index.ts`