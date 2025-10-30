// src/utils/sendLogRegistry.ts
import fs from "fs";
import path from "path";

const LOG_DIR = path.join(process.cwd(), "send_log");
const LOG_FILE = path.join(LOG_DIR, "registrations.log");

// In-memory cache
let cachedSet: Set<string> | null = null;

/**
 * Asegura que exista la carpeta de logs.
 */
async function ensureLogDir() {
  try {
    await fs.promises.mkdir(LOG_DIR, { recursive: true });
  } catch (err) {
    // ignore
  }
}

/**
 * Carga el log (si existe) a un Set en memoria la primera vez.
 */
export async function loadSentEmails(): Promise<Set<string>> {
  if (cachedSet) return cachedSet;

  cachedSet = new Set<string>();
  try {
    await ensureLogDir();
    const exists = fs.existsSync(LOG_FILE);
    if (!exists) return cachedSet;

    const content = await fs.promises.readFile(LOG_FILE, "utf8");
    const lines = content.split(/\r?\n/).filter(Boolean);
    for (const line of lines) {
      // Formato por línea: timestamp|email
      const parts = line.split("|");
      const email = parts[1] ?? parts[0];
      if (email) cachedSet.add(email.trim().toLowerCase());
    }
  } catch (err) {
    console.warn("No se pudo cargar send_log:", err);
  }
  return cachedSet;
}

/**
 * Añade un email al log (archivo) y a la cache en memoria.
 */
export async function addSentEmail(email: string): Promise<void> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return;

  await ensureLogDir();
  if (!cachedSet) await loadSentEmails();

  if (cachedSet!.has(normalized)) return;

  const line = `${new Date().toISOString()}|${normalized}\n`;
  try {
    await fs.promises.appendFile(LOG_FILE, line, { encoding: "utf8" });
    cachedSet!.add(normalized);
  } catch (err) {
    console.error("Error escribiendo en send_log:", err);
    // no re-lanzar: fallo en escribir log no debe romper envío
  }
}

/**
 * Comprueba si un email ya está registrado (en memoria o archivo)
 */
export async function isEmailSent(email: string): Promise<boolean> {
  const normalized = (email || "").trim().toLowerCase();
  if (!normalized) return false;
  const set = await loadSentEmails();
  return set.has(normalized);
}
