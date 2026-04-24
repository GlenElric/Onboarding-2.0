import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
=======
import { BullModule } from '@nestjs/bullmq';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { ContentProcessor } from './content.processor';
>>>>>>> 9f26dcfb01a1ac0abbcb0c4a05ebd7066e032a05
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [
<<<<<<< HEAD
    CoursesModule,
  ],
  controllers: [ContentController],
  providers: [ContentService],
=======
    BullModule.registerQueue({
      name: 'content-processing',
    }),
    CoursesModule,
  ],
  controllers: [ContentController],
  providers: [ContentService, ContentProcessor],
>>>>>>> 9f26dcfb01a1ac0abbcb0c4a05ebd7066e032a05
  exports: [ContentService],
})
export class ContentModule {}
