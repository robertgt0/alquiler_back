export interface RetryOptions {
  retries?: number;
  delayBaseMs?: number;
}

export async function retry<T>(fn: () => Promise<T>, opts: RetryOptions = {}): Promise<T> {
  const retries = opts.retries ?? Number(process.env.NOTIFICATION_MAX_RETRIES) ?? 3;
  const delayBaseMs = opts.delayBaseMs ?? Number(process.env.NOTIFICATION_RETRY_DELAY_MS) ?? 1000;

  let attempt = 0;
  let lastError: any = null;

  while (attempt < retries) {
    try {
      attempt++;
      return await fn();
    } catch (err: any) {
      lastError = err;
      // Si el error no es retryable, re-lanzar inmediatamente
      if (err?.retryable === false) throw err;

      if (attempt >= retries) break;

      // espera exponencial con jitter
      const wait = delayBaseMs * Math.pow(2, attempt - 1);
      const jitter = Math.floor(Math.random() * 200);
      await new Promise((res) => setTimeout(res, wait + jitter));
    }
  }

  throw lastError;
}
