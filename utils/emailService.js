// utils/emailService.js
import nodemailer from 'nodemailer';

// Configurar el transporte (SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail', // o 'hotmail', 'outlook', etc.
  auth: {
    user: process.env.EMAIL_USER, // tu correo
    pass: process.env.EMAIL_PASS  // tu contraseña o app password
  }
});

// Función para enviar un correo
export const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: `"Mi Proyecto" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });
    console.log('Correo enviado:', info.messageId);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};
