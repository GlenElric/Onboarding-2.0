import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { ContentChunkRepository } from '../../repositories/content-chunk.repository';

@Module({
  controllers: [AiController],
  providers: [AiService, ContentChunkRepository],
  exports: [AiService],
})
export class AiModule {}
