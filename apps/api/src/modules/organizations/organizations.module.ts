import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { OrganizationRepository } from '../../repositories/organization.repository';
import { UserRepository } from '../../repositories/user.repository';

@Module({
  controllers: [OrganizationsController],
  providers: [
    OrganizationsService,
    OrganizationRepository,
    UserRepository,
  ],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
