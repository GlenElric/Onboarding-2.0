import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrganizationDto, AddMemberDto } from './dto/organization.dto';
import { OrgRole } from '@prisma/client';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateOrganizationDto) {
    const org = await this.prisma.organization.create({
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
    const user = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.organizationMembership.create({
      data: {
        organizationId: orgId,
        userId: user.id,
        role: data.role,
      },
    });
  }

  async getMyOrganizations(userId: string) {
    return this.prisma.organization.findMany({
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
      throw new ForbiddenException('You do not have the required organization role');
    }

    return true;
  }
}
