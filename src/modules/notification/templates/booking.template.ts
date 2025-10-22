import { baseTemplate } from "./base.template";

export function bookingConfirmationTemplate(data: {
  userName: string;
  serviceName: string;
  date: string;
  price: number;
}) {
  const content = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Confirmación de reserva</h2>
      <p>Hola ${data.userName},</p>
      <p>Tu reserva para <strong>${data.serviceName}</strong> se confirmó correctamente.</p>
      <p><strong>Fecha:</strong> ${data.date}</p>
      <p><strong>Precio:</strong> $${data.price}</p>
      <br/>
      <p>Gracias por usar nuestro servicio.</p>
      <hr/>
      <small>Este correo fue generado automáticamente, por favor no respondas.</small>
    </div>
  `;
  return baseTemplate(content);
}

