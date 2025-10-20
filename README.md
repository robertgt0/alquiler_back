T8: a cargo de Silvia Lili Alarcon Espinoza y Maria Berniz Ramirez Saravia# 🚀 Módulo de Notificaciones + Integración con n8n



Este módulo forma parte del backend **alquiler_back**, desarrollado en **Node.js + TypeScript (ESM)**.  
Su objetivo es manejar el **envío y procesamiento de notificaciones** (por correo, webhook, etc.) y permitir la **integración automática con n8n**.

---

## 🧩 Estructura del Proyecto

backend/
├── src/
│ ├── config/
│ ├── types/
│ ├── utils/
│ ├── middlewares/
│ ├── modules/
│ │ └── notifications/
│ │ ├── config/
│ │ ├── controllers/
│ │ │ └── notification.controller.ts
│ │ ├── routes/
│ │ │ └── notification.routes.ts
│ │ ├── services/
│ │ │ └── notification.service.ts
│ │ ├── workflows/
│ │ │ └── notification.workflow.ts
│ │ ├── models/
│ │ ├── types/
│ │ ├── utils/
│ │ ├── errors/
│ │ └── index.ts
│ └── index.ts
├── dist/
├── .env
├── tsconfig.json
├── package.json
└── README.md


---

## ⚙️ Configuración del entorno

### 1️⃣ Crear archivo `.env`

Crea un archivo `.env` en la raíz del proyecto (es oculto por defecto, usa `ls -a` para verlo).

```bash
NODE_ENV=development
PORT=3001

# Credenciales de correo (para nodemailer)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tu_correo@gmail.com
MAIL_PASS=tu_contraseña_app

# URL de n8n (si aplicas integración bidireccional)
N8N_WEBHOOK_URL=http://localhost:5678/webhook-test/notificaciones


⚠️ Asegúrate de que .env esté en tu .gitignore para no subirlo al repositorio:

.env

🧱 Configuración de TypeScript (tsconfig.json)

El proyecto usa configuración NodeNext (import/export moderno) y soporte para fetch, Node.js y ES2022.

{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "sourceMap": true,
    "declaration": false,
    "removeComments": true,
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022", "DOM"],
    "types": ["node"],
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@config/*": ["config/*"],
      "@modules/*": ["modules/*"],
      "@controllers/*": ["modules/*/controllers/*"],
      "@services/*": ["modules/*/services/*"],
      "@models/*": ["modules/*/models/*"],
      "@utils/*": ["utils/*"]
    },
    "incremental": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}

💡 Flujo de Notificaciones

n8n → Backend:
n8n envía un POST a /api/notify con los datos de la notificación.

Backend procesa:
El módulo notification.workflow.ts ejecuta la lógica:

Valida la notificación.

Envía el correo (via nodemailer).

Registra o reenvía la notificación a n8n (opcional).

Backend → n8n (opcional):
Envía el resultado del proceso a un Webhook de n8n para continuar el flujo.

📡 Ejemplo de endpoint
POST /api/notify
Body:
{
  "to": "usuario@gmail.com",
  "subject": "Prueba desde n8n",
  "message": "Hola desde flujo automatizado 🚀",
  "channel": "email"
}

Respuesta:
{
  "success": true,
  "message": "Notificación procesada correctamente"
}

⚙️ Integración con n8n
n8n → Backend

En n8n, crea un flujo nuevo.

Nodo Manual Trigger → HTTP Request

Configura:

Method: POST

URL: http://localhost:3001/api/notify

Body:

{
  "to": "tu_correo@gmail.com",
  "subject": "Hola desde n8n",
  "message": "Notificación automatizada"
}

Backend → n8n (opcional)

En n8n crea un Webhook Trigger

Copia la URL del webhook y ponla en .env → N8N_WEBHOOK_URL

Tu flujo Node.js enviará un fetch a esa URL cuando termine de procesar la notificación.

🧠 Scripts útiles
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Compilar
npm run build

# Modo producción
npm start

🧰 Dependencias principales
npm install express nodemailer dotenv node-fetch
npm install -D typescript ts-node-dev @types/express @types/node

🧾 Ejemplo de Logs (al enviar una notificación)
🟢 [Workflow] Iniciando procesamiento de notificación...
📧 Enviando correo a: usuario@gmail.com
✅ [Workflow] Notificación procesada con éxito
🔗 [Webhook] Resultado enviado a n8n

📬 Soporte y notas finales

🧠 Los archivos .env son ocultos: usa ls -a para verlos.

🔒 Nunca subas credenciales al repositorio.

🌐 El proyecto usa NodeNext para compatibilidad con ESM y fetch.

🔄 Compatible con integración bidireccional n8n ↔ Node.js.
