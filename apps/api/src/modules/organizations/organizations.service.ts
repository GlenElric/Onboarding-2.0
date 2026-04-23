import { Injectable, ForbiddenException, NotFoundException, Logger } from '@nestjs/common';
import { OrganizationRepository } from '../../repositories/organization.repository';
import { UserRepository } from '../../repositories/user.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrganizationDto, AddMemberDto } from './dto/organization.dto';
import { OrgRole } from '@prisma/client';

@Injectable()
export class OrganizationsService {
  private readonly logger = new Logger(OrganizationsService.name);

  constructor(
    private organizationRepository: OrganizationRepository,
    private userRepository: UserRepository,
    private prisma: PrismaService,
  ) {}

  async create(userId: string, data: CreateOrganizationDto) {
    this.logger.log(`Creating organization: ${data.name} by user ${userId}`);
    const org = await this.organizationRepository.create({
      data: {
        name: data.name,
        slug: data.slug,
        members: {
          create: {
            userId,
            role: OrgRole.ORG_ADMIN,
          },
        },
      },
    });
    return org;
  }

  async addMember(orgId: string, data: AddMemberDto) {
    const user = await this.userRepository.findUnique({ where: { email: data.email } });
    if (!user) throw new NotFoundException('User not found');

    this.logger.log(`Adding user ${user.id} to organization ${orgId} with role ${data.role}`);
    return this.prisma.organizationMembership.create({
      data: {
        organizationId: orgId,
        userId: user.id,
        role: data.role,
      },
    });
  }

  async getMyOrganizations(userId: string) {
    // RBAC enforced at query level: user can only see orgs they are members of
    return this.organizationRepository.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        _count: {
          select: { members: true, courses: true },
        },
      },
    });
  }

  async findOne(userId: string, orgId: string) {
    const org = await this.organizationRepository.findFirst({
        where: {
            id: orgId,
            members: { some: { userId } }
        },
        include: {
            members: { include: { user: { select: { name: true, email: true } } } },
            courses: true,
        }
    });

    if (!org) {
        throw new ForbiddenException('Access denied to this organization');
    }

    return org;
  }

  async checkAccess(userId: string, orgId: string, roles: OrgRole[]) {
    const membership = await this.prisma.organizationMembership.findUnique({
      where: {
        organizationId_userId: {
          organizationId: orgId,
          userId,
        },
      },
    });

    if (!membership || !roles.includes(membership.role)) {
      this.logger.warn(`Access check failed for user ${userId} in org ${orgId}`);
      throw new ForbiddenException('You do not have the required organization role');
    }

    return true;
  }
}
