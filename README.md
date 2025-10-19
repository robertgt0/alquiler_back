T8: a cargo de Silvia Lili Alarcon Espinoza y Maria Berniz Ramirez Saravia

Backend del proyecto Alquiler, con módulo base de notificaciones.

🛠 Estructura del proyecto
alquiler_back/
├── src/
│   ├── config/                 # Configuración global (DB, etc.)
│   ├── middlewares/            # Middlewares
│   ├── models/                 # Modelos de datos
│   ├── modules/
│   │   ├── notifications/      # Módulo de notificaciones
│   │   │   ├── controllers/    # Controladores
│   │   │   ├── workflows/      # Workflow de notificaciones
│   │   │   ├── services/       # Servicios (placeholder)
│   │   │   ├── routes/         # Rutas del módulo
│   │   │   ├── types/          # Tipos TypeScript
│   │   │   └── index.ts        # Exporta el módulo
│   ├── routes/                 # Rutas generales (email, etc.)
│   ├── types/                  # Tipos globales
│   ├── utils/                  # Utilidades (emailService.js)
│   └── index.ts                # Entrada principal del servidor
├── package.json
├── tsconfig.json
└── README.md

⚡ Tecnologías

Node.js

Express

TypeScript

Nodemailer (para envío de correo, placeholder en esta etapa)

dotenv

ts-node-dev (para desarrollo)

🚀 Flujo de notificaciones (base)

Solicitud HTTP POST llega al endpoint /api/notify.

Controlador createNotification recibe los datos y llama a processNotification.

Workflow processNotification decide el canal (email o console) y llama al servicio correspondiente.

Servicio sendEmailNotification (placeholder) registra el envío con console.log.

Devuelve respuesta JSON:

{
  "success": true,
  "message": "Notificación procesada correctamente"
}


Nota: Por ahora el envío real de correo está simulado; el flujo base está diseñado para soportar cualquier canal futuro.

📝 Endpoints
Enviar notificación
POST /api/notify


Body (JSON)

{
  "to": "correo@ejemplo.com",
  "subject": "Asunto de prueba",
  "message": "Mensaje de prueba",
  "channel": "email"
}


Respuesta

{
  "success": true,
  "message": "Notificación procesada correctamente"
}

⚙️ Configuración del proyecto

Instalar dependencias:

npm install


Variables de entorno en .env (opcional para integración real de email):

EMAIL_USER=tu_correo@gmail.com
EMAIL_PASS=tu_app_password
PORT=5000


Ejecutar servidor en desarrollo:

npx ts-node-dev --respawn --transpile-only src/index.ts


Probar endpoint con CURL o Postman.

🧩 Notas

El flujo base está listo para extenderse a envío real de correos, notificaciones push, SMS, etc.

La lógica de notificaciones está centralizada en el workflow, permitiendo añadir fácilmente nuevos canales.

sendEmailNotification actualmente es un placeholder que imprime en consola el mensaje.
