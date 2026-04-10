import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Public } from '../auth/public.decorator';
import { CreateCourseDto, CreateModuleDto, CreateTopicDto } from './dto/course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Public()
  @Get()
  async findAll() {
    return this.coursesService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  @Post(':id/versions')
  async createVersion(@Param('id') id: string, @Body() data: any) {
    return this.coursesService.createVersion(id, data);
  }

  @Post('versions/:versionId/modules')
  async addModule(@Param('versionId') versionId: string, @Body() dto: CreateModuleDto) {
    return this.coursesService.addModule(versionId, dto);
  }

  @Post('modules/:moduleId/topics')
  async addTopic(@Param('moduleId') moduleId: string, @Body() dto: CreateTopicDto) {
    return this.coursesService.addTopic(moduleId, dto);
  }

  /** Returns full topic content (chunks + materials + question count) */
  @Public()
  @Get('topics/:topicId')
  async getTopic(@Param('topicId') topicId: string) {
    return this.coursesService.getTopicWithContent(topicId);
  }

  /** Returns raw content chunks (used by AI service) */
  @Get('topics/:topicId/chunks')
  async getChunks(@Param('topicId') topicId: string) {
    return this.coursesService.getTopicChunks(topicId);
  }

  /** Store a content chunk (called by AI service after PDF processing) */
  @Post('topics/:topicId/chunks')
  async addChunk(@Param('topicId') topicId: string, @Body() body: { content: string; chunkIndex: number; materialVersionId: string }) {
    return this.coursesService.addContentChunk(topicId, body);
  }
}
