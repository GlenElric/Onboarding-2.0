import { Module } from '@nestjs/common';
import { CommerceService } from './commerce.service';
import { CommerceController } from './commerce.controller';

@Module({
  providers: [CommerceService],
  controllers: [CommerceController],
  exports: [CommerceService],
})
export class CommerceModule {}
