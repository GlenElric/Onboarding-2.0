import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { CreateModuleDto } from './dto/module.dto';
import { CreateTopicDto, CreateChunkDto } from './dto/topic.dto';
import { Public } from '../auth/public.decorator';

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
  async create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
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
    return this.coursesService.getTopicWithContent(topicId);
  }

  @Get('topics/:topicId/chunks')
  async getChunks(@Param('topicId') topicId: string) {
    return this.coursesService.getTopicChunks(topicId);
  }

  @Post('topics/:topicId/chunks')
  async addChunk(@Param('topicId') topicId: string, @Body() body: CreateChunkDto) {
    return this.coursesService.addContentChunk(topicId, body);
  }
}
