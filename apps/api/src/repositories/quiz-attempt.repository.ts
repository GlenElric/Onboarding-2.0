import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseRepository } from './base.repository';
import { QuizAttempt } from '@prisma/client';

@Injectable()
export class QuizAttemptRepository extends BaseRepository<QuizAttempt, any, any> {
  constructor(prisma: PrismaService) {
    super(prisma, 'quizAttempt');
  }
}
