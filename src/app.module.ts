import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './main/auth/auth.module';
import { UserModule } from './main/user/user.module';
import { MailModule } from './main/mail/mail.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PrismaModule } from './prisma/prisma.module';
import { CloudinaryService } from './main/cloudinary/cloudinary.service';
import { SopModule } from './main/sop/sop.module';
import { ReportModule } from './main/report/report.module';
import { AdminModule } from './main/admin/admin.module';
import { join } from 'path';
import { MedicineModule } from './main/medicine/medicine.module';
import { SeederService } from './seeder/seederService';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', // URL prefix
    }),
    ConfigModule.forRoot({ isGlobal: true }),

    PrismaModule,
    AuthModule,
    UserModule,
    MailModule,
    SopModule,
    ReportModule,
    AdminModule,
    MedicineModule,
  ],
  controllers: [AppController],
  providers: [AppService, CloudinaryService,SeederService],
})
export class AppModule {}
