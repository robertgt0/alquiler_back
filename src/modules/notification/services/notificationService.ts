// src/modules/notification/services/notificationService.ts
import { NotificationModel, INotificationPackage } from '../models/Notification';
import gmailService from './gmailService'; // si existe
import { NotificationModel as _ } from '../models/Notification';

export async function saveNotification(pkg: Partial<INotificationPackage>) {
  const doc = new NotificationModel({
    ...pkg,
    id: pkg.id ?? `pkg_${Date.now()}`,
    createdAt: pkg.createdAt ?? new Date(),
    status: pkg.status ?? 'pending'
  });
  await doc.save();
  return doc;
}

export async function processNotification(pkg: INotificationPackage) {
  // Guardar
  const saved = await saveNotification(pkg);

  /*
  // Si es email y existe gmailService, llamalo. No bloqueante si querés:
  if (pkg.message?.type === 'email' && gmailService?.sendEmail) {
    try {
      // llamar en background, pero aquí dejo await para simplicidad
      await gmailService.sendEmail(pkg, saved);
      // actualizar estado
      saved.status = 'sent';
      await saved.save();
    } catch (err) {
      saved.status = 'failed';
      await saved.save();
    }
  }
  */

  return saved;
}
