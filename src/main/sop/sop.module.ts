import { Module } from '@nestjs/common';
import { SopService } from './sop.service';
import { SopController } from './sop.controller';
import { NotificationService } from 'src/utils/fireBase/notification.service';

@Module({
  controllers: [SopController],
  providers: [SopService,NotificationService],
})
export class SopModule {}
