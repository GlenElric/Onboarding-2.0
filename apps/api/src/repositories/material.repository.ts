import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseRepository } from './base.repository';
import { Material } from '@prisma/client';

@Injectable()
export class MaterialRepository extends BaseRepository<Material, any, any> {
  constructor(prisma: PrismaService) {
    super(prisma, 'material');
  }
}
