import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './main/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './main/user/user.module';
import { MailModule } from './main/mail/mail.module';

import { PrismaModule } from './prisma/prisma.module';
import { CloudinaryService } from './main/cloudinary/cloudinary.service';
import { SopModule } from './main/sop/sop.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    PrismaModule,
    AuthModule,
    UserModule,
    MailModule,
    SopModule,
  
  ],
  controllers: [AppController],
  providers: [AppService, CloudinaryService],
})
export class AppModule {}
