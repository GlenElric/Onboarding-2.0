import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseRepository } from './base.repository';
import { Module } from '@prisma/client';

@Injectable()
export class ModuleRepository extends BaseRepository<Module, any, any> {
  constructor(prisma: PrismaService) {
    super(prisma, 'module');
  }
}
