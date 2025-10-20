import axios from 'axios';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
const N8N_WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET;

export async function triggerN8n(payload: any) {
  if (!N8N_WEBHOOK_URL) {
    console.warn('[n8n] N8N_WEBHOOK_URL not configured, skipping trigger.');
    return { success: false, reason: 'N8N_WEBHOOK_URL not configured' };
  }

  try {
    const headers: any = { 'Content-Type': 'application/json' };
    if (N8N_WEBHOOK_SECRET) headers['X-Webhook-Secret'] = N8N_WEBHOOK_SECRET;

    const res = await axios.post(N8N_WEBHOOK_URL, payload, { headers, timeout: 10000 });
    return { success: true, status: res.status, data: res.data };
  } catch (err: any) {
    console.error('[n8n] Error triggering webhook:', err?.response?.data ?? err.message ?? err);
    return { success: false, reason: err?.message ?? 'unknown' };
  }
}
