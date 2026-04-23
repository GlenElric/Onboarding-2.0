import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { CourseRepository } from '../../repositories/course.repository';
import { ModuleRepository } from '../../repositories/module.repository';
import { TopicRepository } from '../../repositories/topic.repository';
import { ContentChunkRepository } from '../../repositories/content-chunk.repository';

@Module({
  controllers: [CoursesController],
  providers: [
    CoursesService,
    CourseRepository,
    ModuleRepository,
    TopicRepository,
    ContentChunkRepository,
  ],
  exports: [CoursesService],
})
export class CoursesModule {}
