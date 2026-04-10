import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.coursesService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.coursesService.update(id, data);
  }

  @Post(':id/modules')
  async addModule(@Param('id') id: string, @Body() data: any) {
    return this.coursesService.addModule(id, data);
  }

  @Post('modules/:moduleId/topics')
  async addTopic(@Param('moduleId') moduleId: string, @Body() data: any) {
    return this.coursesService.addTopic(moduleId, data);
  }

  /** Returns full topic content (chunks + materials + question count) */
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
  async addChunk(@Param('topicId') topicId: string, @Body() body: { content: string; order: number }) {
    return this.coursesService.addContentChunk(topicId, body);
  }
}
