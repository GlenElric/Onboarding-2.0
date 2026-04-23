import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseRepository } from './base.repository';
import { TopicProgress } from '@prisma/client';

@Injectable()
export class TopicProgressRepository extends BaseRepository<TopicProgress, any, any> {
  constructor(prisma: PrismaService) {
    super(prisma, 'topicProgress');
  }
}
