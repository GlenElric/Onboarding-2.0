import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseRepository } from './base.repository';
import { Topic } from '@prisma/client';

@Injectable()
export class TopicRepository extends BaseRepository<Topic, any, any> {
  constructor(prisma: PrismaService) {
    super(prisma, 'topic');
  }
}
