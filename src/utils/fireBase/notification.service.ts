import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseAdmin } from './admin.provider';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from 'generated/prisma';


@Injectable()
export class NotificationService {
  constructor(
    @Inject(FirebaseAdmin) private readonly firebaseApp: admin.app.App,
    private readonly prisma: PrismaService,
  ) {}
  async sendNotification({
    title,
    message,
    options,
    tokens,
  }: {
    title: string;
    message: string;
    options?: {
      userIds?: string[];
      roles?: UserRole[];
      notificationEnabled?: boolean;
    };
    tokens?: string[];
  }) {
    let deviceTokens: string[] = [];

    if (tokens && tokens.length > 0) {
      // Use provided tokens directly
      deviceTokens = tokens;
    } else {
      // Fetch tokens from DB based on options
      const users = await this.prisma.credential.findMany({
        where: {
          AND: [
            options?.userIds ? { id: { in: options.userIds } } : {},
            options?.roles ? { role: { in: options.roles } } : {},
          ],
          userDevice: { some: {} },
        },
        include: { userDevice: true },
      });

      deviceTokens = users.flatMap(u => u.userDevice.map(d => d.token));
    }

    if (deviceTokens.length === 0) return;

    const payload = {
      notification: { title, body: message },
      tokens: deviceTokens,
    };

    try {
      const response = await this.firebaseApp.messaging().sendEachForMulticast(payload);
      console.log('Notification sent:', response);
    } catch (err) {
      console.error('Error sending notification:', err);
    }
  }

  /**
   * Save or update FCM token for a user
   */
  async saveUserDeviceToken(userId: string, token: string) {
    await this.prisma.userDeviceToken.upsert({
      where: { token },
      update: { userId },
      create: { userId, token },
    });
  }
}
