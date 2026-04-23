import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseRepository } from './base.repository';
import { Question } from '@prisma/client';

@Injectable()
export class QuestionRepository extends BaseRepository<Question, any, any> {
  constructor(prisma: PrismaService) {
    super(prisma, 'question');
  }
}
