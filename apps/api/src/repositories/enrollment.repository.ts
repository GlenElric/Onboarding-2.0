import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseRepository } from './base.repository';
import { CourseEnrollment } from '@prisma/client';

@Injectable()
export class EnrollmentRepository extends BaseRepository<CourseEnrollment, any, any> {
  constructor(prisma: PrismaService) {
    super(prisma, 'courseEnrollment');
  }
}
