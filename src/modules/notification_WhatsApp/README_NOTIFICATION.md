# Notification Service

Servicio backend de notificaciones desarrollado en Node.js + Express + TypeScript + MongoDB, diseñado para centralizar el envío y registro de notificaciones dentro de un sistema principal.  
El servicio puede comunicarse con flujos automatizados de n8n, almacenar información en MongoDB, y manejar plantillas de correo HTML para distintas acciones del sistema manteniendo una conexion con la APi de GMAIL(oathus).

## Descripción del servicio

El Notification Service permite:
- Recibir solicitudes de notificación vía API REST.
- Registrar los mensajes y destinatarios en la base de datos.
- Enviar notificaciones a través de webhooks n8n o correo electrónico.

## EStructura ##
## Estructura del proyecto##

modules/
└── notification/
    ├── config/         # Configuración del módulo (base de datos, variables)
    │   ├── database.ts
    │   └── module.config.ts
    │
    ├── controllers/            # Controladores principales (manejo de peticiones)
    │   ├── central.controller.ts
    │   └── notification.controller.ts
    │
    ├── dtos/           # Objetos de transferencia de datos (DTOs)
    │   └── createNotification.dto.ts
    │
    ├── errors/         # Manejo centralizado de errores
    │   ├── AppError.ts
    │   ├── errorHandler.ts
    │   └── notification.errors.ts
    │
    ├── middlewares/            # Validaciones y control de flujo HTTP
    │   ├── error.middleware.ts
    │   ├── notFound.middleware.ts
    │   ├── request.middleware.ts
    │   └── validate.middleware.ts
    │
    ├── models/         # Entidades y modelos de datos
    │   ├── notification.entity.ts
    │   ├── notification.model.ts
    │   └── Notification.ts
    │
    ├── providers/          # Integraciones externas (Gmail API, n8n)
    │   ├── gmail.api.ts
    │   └── n8n.provider.ts
    │
    ├── routes/             # Definición de rutas del módulo
    │   ├── central.router.ts
    │   └── notification.routes.ts
    │
    ├── services/           # Lógica de negocio y conexión entre capas
    │   ├── central.service.ts
    │   ├── n8n.service.ts
    │   └── notification.service.ts
    │
    ├── templates/          # Plantillas de correo o notificación
    │   ├── base.template.ts
    │   ├── booking.template.ts
    │   ├── index.ts
    │   └── payment.template.ts
    │
    ├── types/          # Tipos TypeScript para estructura segura
    │   ├── index.ts
    │   └── notification.types.ts
    │
    ├── utils/          # Funciones auxiliares y logger
    │   ├── helpers.ts
    │   ├── logger.ts
    │   └── loggerExtended.ts
    │
    ├── workflows/          # Automatizaciones y flujos n8n
    │   ├── notification.workflow.ts
    │   └── index.ts
    │
    ├── PAYLOAD PARA N8N.md
    ├── README_NOTIFICATION.md
    └── README.md
    

**estructura del payload para enviar correo de Backend --> n8n clouod --> Gmail API**

{
  "subject": "texto",
  "message": "texto o HTML",
  "destinations": [{ "email": "...", "name": "..." }],
  "fromName": "nombre opcional"
}

TENER EN CUENTA PARA EVITAR CONFUCIONES

**para enviarlo desde postman: Postman -- n8n cloud --> Gmail APi**

{
  "fixerEmail": "adrianvallejosflores24@gmail.com",
  "subject": "PRUEBA TAREA T9",
  "message": "<html>hola mundito :)</html>", 
  "id": "ID interno (opcional)",
  "type": "nuevo_cliente" 
}
##  Dependencias instaladas

### Dependencias principales
 Paquete  Descripción
express  Framework HTTP para Node.js 
cors  Permite solicitudes desde orígenes cruzados
helmet  Cabeceras seguras para la API
dotenv  Carga variables desde `.env` 
mongoose  ODM para MongoDB 
uuid  Generación de identificadores únicos
node-fetch  Peticiones HTTP hacia n8n
nodemailer  Envío de correos electrónicos
googleapis  Soporte para Gmail API si se usa OAuth2
axios  Cliente HTTP alternativo para consumo externo

### Dependencias de desarrollo
Paquete y Descripción 

typescript  Tipado estático
ts-node-dev  Ejecución con recarga automática
cross-env  Configura variables de entorno multiplataforma
 @types/node, @types/express, @types/cors, @types/uuid  Tipos para TS 
eslint, prettier Lint y formato opcional 

##  Instrucciones de instalación

Clonar el repositorio

Instalar dependencias

terminal
    npm install
Esto descargará automáticamente todas las dependencias listadas en el archivo package.json.

Verificar la estructura
    Estar ubicado correctamente en la carpeta

Configurar variables de entorno
    Crear un archivo .env siguiendo el modelo anterior.

Verificar conexión a MongoDB
    Antes de ejecutar el servidor, confirma que tu base de datos esté accesible desde la URI indicada.

**Instrucciones de ejecución**

terminal

Para ejecutar la prueba desde el backend y simular un evento interno sin usar Postman, deberemos trabajar en dos terminales distintas.

Una donde haremos el clásico: npm run dev

Y otra donde ejecutaremos: npx ts-node src/testsNotification/exitoSimple.ts

Deberemos ver en ambas terminales la confirmación clásica. Además, se deberá ver que en el workflow, en la sección de "Executions" (Ejecuciones), se haya recorrido correctamente.

Y obvio, [comprobar] que haya llegado el correo al destino.

Pueden hacer pruebas enviando campos vacíos, ya que correos ficticios no los detecta y lo toma como que sí o sí lo envió (aunque la dirección no exista).


**Detalles de dependencias e instalables anotados**

npm install nodemailer googleapis uuid winston

npm install -D @types/nodemailer @types/uuid

npm install uuid

npm install -D @types/express-validator

npm install express-validator

npm install --save-dev @types/express-validator

npm install express-validator nodemailer googleapis uuid winston

npm install --save-dev @types/express-validator @types/nodemailer @types/uuid

npm install validator

npm i --save-dev @types/validator

npm install axios

npm install axios dotenv

npm install uuid

npm install --save-dev @types/uuid


**Body definidos para hacer las respectivas peticiones**
estructura del payload para enviar correo de Backend --> n8n clouod --> Gmail API

{
  "subject": "texto",
  "message": "texto o HTML",
  "destinations": [{ "email": "...", "name": "..." }],
  "fromName": "nombre opcional"
}



para enviarlo desde postman: Postman -- n8n cloud --> Gmail APi

{
  "email": "adrianvallejosflores24@gmail.com",
  "subject": "PRUEBA TAREA T9",
  "message": "<html>hola mundito :)</html>", 
  "id": "ID interno (opcional)",
  "type": "nuevo_cliente" 
}

