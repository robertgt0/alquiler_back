import fs from "fs";
import path from "path";

const logDir = path.join(process.cwd(), "logs");
const logFile = path.join(logDir, "system_log.txt");

/** Logger extendido: complementa tu utils/logger.ts (no lo reemplaza) */
export function logSystem(
    level: "INFO" | "WARN" | "ERROR",
    message: string,
    context: Record<string, any> = {}
) {
    const entry = { ts: new Date().toISOString(), level, message, ...context };

    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
    fs.appendFileSync(logFile, JSON.stringify(entry) + "\n");

    if (process.env.NODE_ENV !== "production") {
        console.log(`[${level}]`, message, context);
    }
}
