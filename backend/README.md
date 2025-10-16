# Servicio Central de Notificaciones (Backend)

## Descripción
Servicio que recibe paquetes JSON en POST /api/notify y envía notificaciones por Gmail.

## Ejecutar (dev)
1. Copiar .env.example -> .env y completar variables.
2. npm install
3. npm run dev

## Endpoint
POST /api/notify
Headers: x-api-key
Body JSON: { type, recipient:{email,name}, data:{message} }
