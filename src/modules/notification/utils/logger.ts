import fs from "fs";
import path from "path";

const logPath = path.join(process.cwd(), "logs", "send_log.txt");

/**
 * Registra en un archivo cada intento de envío
 * @param to destinatario
 * @param status estado del envío ("OK", "FALLIDO", "ERROR")
 * @param transactionId id único de la transacción
 * @param errorMsg mensaje de error opcional
 */
export function logNotification(
  to: string,
  status: string,
  transactionId: string,
  errorMsg: string = ""
) {
  const timestamp = new Date().toISOString();
  const line = `${timestamp} | TxID: ${transactionId} | To: ${to} | Estado: ${status}${errorMsg ? " | Error: " + errorMsg : ""}\n`;

  // Asegurar que el directorio exista
  if (!fs.existsSync(path.dirname(logPath))) {
    fs.mkdirSync(path.dirname(logPath), { recursive: true });
  }

  fs.appendFileSync(logPath, line);
}