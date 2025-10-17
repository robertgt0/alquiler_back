# Gmail Notifier

Servicio HTTP para enviar notificaciones por Gmail usando **Gmail API + OAuth2**.

## Requisitos
- Node.js 18+
- Proyecto en Google Cloud con **Gmail API habilitada**
- Credenciales OAuth 2.0 tipo **Aplicación web**
- Redirect: `http://localhost:4000/oauth/callback`

## Instalación
```bash
npm install
cp .env.example .env   
