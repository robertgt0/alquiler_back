import { baseTemplate } from "./base.template";

export function paymentReceiptTemplate(data: {
  userName: string;
  serviceName: string;
  amount: number;
  date: string;
  paymentMethod: string;
}) {
  const content = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Comprobante de pago</h2>
      <p>Hola ${data.userName},</p>
      <p>Tu pago fue procesado exitosamente para el servicio <strong>${data.serviceName}</strong>.</p>
      <ul>
        <li><strong>Método de pago:</strong> ${data.paymentMethod}</li>
        <li><strong>Fecha:</strong> ${data.date}</li>
        <li><strong>Monto:</strong> $${data.amount.toFixed(2)}</li>
      </ul>
      <br/>
      <p>Gracias por tu confianza.</p>
      <hr/>
      <small>Este mensaje fue generado automáticamente, por favor no respondas.</small>
    </div>
  `;
  return baseTemplate(content);
}
