import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseRepository } from './base.repository';
import { Organization } from '@prisma/client';

@Injectable()
export class OrganizationRepository extends BaseRepository<Organization, any, any> {
  constructor(prisma: PrismaService) {
    super(prisma, 'organization');
  }
}
