import { Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentRepository } from '../../repositories/enrollment.repository';
import { TopicProgressRepository } from '../../repositories/topic-progress.repository';
import { CourseRepository } from '../../repositories/course.repository';
import { TopicRepository } from '../../repositories/topic.repository';

@Module({
  controllers: [EnrollmentsController],
  providers: [
    EnrollmentsService,
    EnrollmentRepository,
    TopicProgressRepository,
    CourseRepository,
    TopicRepository,
  ],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}
