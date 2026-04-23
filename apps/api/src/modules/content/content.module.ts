import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { ContentProcessor } from './content.processor';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'content-processing',
    }),
    CoursesModule,
  ],
  providers: [ContentService, ContentProcessor],
  controllers: [ContentController],
  exports: [ContentService],
})
export class ContentModule {}
