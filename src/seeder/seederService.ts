import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'generated/prisma';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger(SeederService.name);

  // This method runs automatically when the app starts
  async onApplicationBootstrap() {
    await this.seedAdmin();
  }

  // Seed a default super admin if it doesn't exist
  private async seedAdmin() {
    const adminEmail = process.env.SUPER_ADMIN as string;
    const adminPassword = process.env.ADMIN_PASS as string;

    if (!adminEmail || !adminPassword) {
      this.logger.warn(
        'SUPER_ADMIN email or ADMIN_PASS is not set in environment variables.',
      );
      return;
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    try {
      await this.prisma.credential.upsert({
        where: { email: adminEmail }, // Unique email constraint
        update: {}, // Do nothing if already exists
        create: {
          email: adminEmail,
          password: hashedPassword,
          role: UserRole.SUPER_ADMIN,
          firstName: 'Super',
          lastName: 'Admin',
          isApproved: true,
        },
      });

      this.logger.log(`Default super admin ensured: ${adminEmail}`);
    } catch (error) {
      this.logger.error(
        `Failed to seed super admin: ${error instanceof Error ? error.message : error}`,
      );
    }
  }
}
