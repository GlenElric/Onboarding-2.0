import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseRepository } from './base.repository';
import { ContentChunk } from '@prisma/client';

@Injectable()
export class ContentChunkRepository extends BaseRepository<ContentChunk, any, any> {
  constructor(prisma: PrismaService) {
    super(prisma, 'contentChunk');
  }
}
