// src/utils/logger.ts
import { createLogger, transports, format } from "winston";
const { combine, timestamp, printf, colorize } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}] ${message}`;
});

export const logger = createLogger({
  level: "informacion",
  format: combine(timestamp(), myFormat),
  transports: [
    new transports.Console({
      format: combine(colorize(), timestamp(), myFormat),
    }),
    // new transports.File({ filename: 'logs/notifications.log' }) // opcional
  ],
});
