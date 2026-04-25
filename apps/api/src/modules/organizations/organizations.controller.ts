import { Controller, Post, Get, Body, Param, Request } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto, AddMemberDto, AssignCourseDto } from './dto/organization.dto';
import { OrgRole } from '@prisma/client';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  async create(@Body() createOrgDto: CreateOrganizationDto, @Request() req) {
    return this.organizationsService.create(req.user.id, createOrgDto);
  }

  @Get('my')
  async getMy(@Request() req) {
    return this.organizationsService.getMyOrganizations(req.user.id);
  }

  @Post(':id/members')
  async addMember(
    @Param('id') id: string,
    @Body() addMemberDto: AddMemberDto,
    @Request() req,
  ) {
    await this.organizationsService.checkAccess(req.user.id, id, [OrgRole.ORG_ADMIN, OrgRole.MANAGER]);
    return this.organizationsService.addMember(id, addMemberDto);
  }

  @Post(':id/courses/assign')
  async assignCourse(
    @Param('id') id: string,
    @Body() data: AssignCourseDto,
    @Request() req,
  ) {
    await this.organizationsService.checkAccess(req.user.id, id, [OrgRole.ORG_ADMIN, OrgRole.MANAGER]);
    return this.organizationsService.assignCourseToMember(id, data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.organizationsService.findOne(req.user.id, id);
  }
}
