import { Module } from '@nestjs/common';
import { SopService } from './sop.service';
import { SopController } from './sop.controller';

@Module({
  controllers: [SopController],
  providers: [SopService],
})
export class SopModule {}
