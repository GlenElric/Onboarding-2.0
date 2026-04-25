import { Controller, Get, Post, Put, Delete, Body, Param, Logger } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { CreateModuleDto } from './dto/module.dto';
import { CreateTopicDto, CreateChunkDto } from './dto/topic.dto';
import { Public } from '../auth/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { PlatformRole } from '@prisma/client';

@Controller('courses')
export class CoursesController {
  private readonly logger = new Logger(CoursesController.name);

  constructor(private readonly coursesService: CoursesService) {}

  @Public()
  @Get()
  async findAll() {
    const courses = await this.coursesService.findAll();
    this.logger.log(`GET /courses - Returning ${courses.length} courses. IDs: ${courses.map(c => c.id).join(', ')}`);
    return courses;
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`GET /courses/${id} - Char codes: ${Array.from(id).map(c => c.charCodeAt(0)).join(',')}`);
    return this.coursesService.findOne(id);
  }

  @Roles(PlatformRole.PLATFORM_ADMIN)
  @Post()
  async create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Roles(PlatformRole.PLATFORM_ADMIN)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Roles(PlatformRole.PLATFORM_ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.coursesService.delete(id);
  }

  @Post(':id/modules')
  async addModule(@Param('id') id: string, @Body() data: CreateModuleDto) {
    return this.coursesService.addModule(id, data);
  }

  @Post('modules/:moduleId/topics')
  async addTopic(@Param('moduleId') moduleId: string, @Body() data: CreateTopicDto) {
    return this.coursesService.addTopic(moduleId, data);
  }

  @Get('topics/:topicId')
  async getTopic(@Param('topicId') topicId: string) {
    this.logger.log(`GET /courses/topics/${topicId}`);
    return this.coursesService.getTopicWithContent(topicId);
  }

  @Public()
  @Get('topics/:topicId/chunks')
  async getChunks(@Param('topicId') topicId: string) {
    return this.coursesService.getTopicChunks(topicId);
  }

  @Post('topics/:topicId/chunks')
  async addChunk(@Param('topicId') topicId: string, @Body() body: CreateChunkDto) {
    return this.coursesService.addContentChunk(topicId, body);
  }

  @Delete('topics/:topicId')
  async deleteTopic(@Param('topicId') topicId: string) {
    await this.coursesService.deleteTopic(topicId);
    return { message: 'Topic deleted successfully' };
  }
}
