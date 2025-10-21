import { Router, Request, Response } from 'express';

class NotificationDemoService {
  static async sendDemoNotification(payload: { to: string; subject?: string; message?: string }) {
    // Minimal implementation to satisfy the route during development/testing.
    // Replace with real notifier (email/sms/push) implementation as needed.
    return {
      success: true,
      sentTo: payload.to,
      subject: payload.subject ?? null,
      message: payload.message ?? null,
      timestamp: new Date().toISOString(),
    };
  }
}

const router = Router();

router.post('/demo/send', async (req: Request, res: Response) => {
  const { to, subject, message } = req.body;
  const result = await NotificationDemoService.sendDemoNotification({ to, subject, message });
  res.json(result);
});

export default router;
