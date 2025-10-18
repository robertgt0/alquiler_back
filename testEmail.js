// testEmail.js
import 'dotenv/config'; // Carga las variables del .env
import nodemailer from 'nodemailer';

// Crear el transporte (con Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Definir el mensaje
const mailOptions = {
  from: `"Proyecto Backend" <${process.env.EMAIL_USER}>`,
  to: 'mark2004andy@gmail.com', // puedes cambiar el destinatario si quieres
  subject: '✅ Prueba de Nodemailer',
  text: 'Hola Mark! Este es un correo de prueba enviado desde Node.js 🚀',
};

// Enviar el correo
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('❌ Error al enviar el correo:', error);
  } else {
    console.log('✅ Correo enviado correctamente:', info.response);
  }
});
