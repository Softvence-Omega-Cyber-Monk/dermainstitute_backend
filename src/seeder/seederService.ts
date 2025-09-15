import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'generated/prisma';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger(SeederService.name);

  async onApplicationBootstrap() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const adminEmail = process.env.SUPER_ADMIN as string;
    const adminPassword = process.env.ADMIN_PASS as string;

    const supperAdmin = await this.prisma.credential.findFirst({
      where: { role: UserRole.SUPER_ADMIN },
    });

    if (supperAdmin) {
      this.logger.log('Admin is already exists, skipping seeding.');
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await this.prisma.credential.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        firstName: 'Super',
        lastName: 'Admin',
        isApproved: true,
      },
    });

    this.logger.log(`Default super admin created: ${adminEmail}`);
  }
}
