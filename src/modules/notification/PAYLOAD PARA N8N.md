estructura del payload para enviar correo de Backend --> n8n clouod --> Gmail API

{
  "subject": "texto",
  "message": "texto o HTML",
  "destinations": [{ "email": "...", "name": "..." }],
  "fromName": "nombre opcional"
}




TENER EN CUENTA PARA EVITAR CONFUCIONES






para enviarlo desde postman: Postman -- n8n cloud --> Gmail APi

{
  "email": "adrianvallejosflores24@gmail.com",
  "subject": "PRUEBA TAREA T9",
  "message": "<html>hola mundito :)</html>", 
  "id": "ID interno (opcional)",
  "type": "nuevo_cliente" 
}

