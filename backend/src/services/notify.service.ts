import nodemailer from 'nodemailer';
import { NotifyPayload } from '../types/notify';

export const sendEmail = async (payload: NotifyPayload) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: payload.recipient.email,
    subject: `Notificación: ${payload.type}`,
    text: payload.data.message
  };

  await transporter.sendMail(mailOptions);
};
