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

esto no estaba en el git

## Servicio de Notification 

Servicio backend de notificaciones desarrollado en Node.js + Express + TypeScript + MongoDB, diseñado para centralizar el envío y registro de notificaciones dentro de un sistema principal.  
El servicio puede comunicarse con flujos automatizados de n8n, almacenar información en MongoDB, y manejar plantillas de correo HTML para distintas acciones del sistema.

## Descripción del servicio

El Notification Service permite:
- Recibir solicitudes de notificación vía API REST.
- Registrar los mensajes y destinatarios en la base de datos.
- Enviar notificaciones a través de webhooks n8n o correo electrónico.


##  Dependencias instaladas

### Dependencias principales
 Paquete ,Descripción
express ,Framework HTTP para Node.js 
cors  ,Permite solicitudes desde orígenes cruzados
helmet ,Cabeceras seguras para la API
dotenv ,Carga variables desde `.env` 
mongoose ,ODM para MongoDB 
uuid ,Generación de identificadores únicos
node-fetch ,Peticiones HTTP hacia n8n
nodemailer ,Envío de correos electrónicos
googleapis ,Soporte para Gmail API si se usa OAuth2
axios ,Cliente HTTP alternativo para consumo externo

### Dependencias de desarrollo
Paquete y Descripción 

typescript  Tipado estático
ts-node-dev  Ejecución con recarga automática
cross-env  Configura variables de entorno multiplataforma
 @types/node, @types/express, @types/cors, @types/uuid  Tipos para TS 
eslint, prettier | Lint y formato opcional 

##  Instrucciones de instalación

Instalar dependencias

  npm install

## Ejecución del servicio

Para ejecutar la prueba desde el backend y simular un evento interno sin usar Postman, deberemos trabajar en dos terminales distintas.

Una donde haremos el clásico: npm run dev

Y otra donde ejecutaremos: npx ts-node src/testsNotification/exitoSimple.ts

Deberemos ver en ambas terminales la confirmación clásica. Además, se deberá ver que en el workflow, en la sección de "Executions" (Ejecuciones), se haya recorrido correctamente.

Y obvio, [comprobar] que haya llegado el correo al destino.

Pueden hacer pruebas enviando campos vacíos, ya que correos ficticios no los detecta y lo toma como que sí o sí lo envió (aunque la dirección no exista).