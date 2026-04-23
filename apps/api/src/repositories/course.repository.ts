import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseRepository } from './base.repository';
import { Course } from '@prisma/client';
import { CreateCourseDto, UpdateCourseDto } from '../modules/courses/dto/course.dto';

@Injectable()
export class CourseRepository extends BaseRepository<Course, CreateCourseDto, UpdateCourseDto> {
  constructor(prisma: PrismaService) {
    super(prisma, 'course');
  }
}
