import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { CourseRepository } from '../../repositories/course.repository';
import { ModuleRepository } from '../../repositories/module.repository';
import { TopicRepository } from '../../repositories/topic.repository';
import { ContentChunkRepository } from '../../repositories/content-chunk.repository';
<<<<<<< HEAD
import { MaterialRepository } from '../../repositories/material.repository';
=======
>>>>>>> 9f26dcfb01a1ac0abbcb0c4a05ebd7066e032a05

@Module({
  controllers: [CoursesController],
  providers: [
    CoursesService,
    CourseRepository,
    ModuleRepository,
    TopicRepository,
    ContentChunkRepository,
<<<<<<< HEAD
    MaterialRepository,
=======
>>>>>>> 9f26dcfb01a1ac0abbcb0c4a05ebd7066e032a05
  ],
  exports: [CoursesService],
})
export class CoursesModule {}
