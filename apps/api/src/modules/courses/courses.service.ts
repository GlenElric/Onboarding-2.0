import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CourseRepository } from '../../repositories/course.repository';
import { ModuleRepository } from '../../repositories/module.repository';
import { TopicRepository } from '../../repositories/topic.repository';
import { ContentChunkRepository } from '../../repositories/content-chunk.repository';
import { MaterialRepository } from '../../repositories/material.repository';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';

@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name);

  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly moduleRepository: ModuleRepository,
    private readonly topicRepository: TopicRepository,
    private readonly chunkRepository: ContentChunkRepository,
    private readonly materialRepository: MaterialRepository,
  ) {}

  async findAll() {
    return this.courseRepository.findMany({
      include: {
        _count: {
          select: { modules: true, enrollments: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const course = await this.courseRepository.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            topics: { orderBy: { order: 'asc' } },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async create(data: CreateCourseDto) {
    this.logger.log(`Creating course: ${data.title}`);
    return this.courseRepository.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        difficulty: data.difficulty || 'Beginner',
        price: data.price || 0,
      },
    });
  }

  async update(id: string, data: UpdateCourseDto) {
    return this.courseRepository.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        difficulty: data.difficulty,
        price: data.price,
      },
    });
  }

  async addModule(courseId: string, data: any) {
    return this.moduleRepository.create({
      data: {
        title: data.title,
        order: data.order,
        courseId,
      },
    });
  }

  async addTopic(moduleId: string, data: any) {
    return this.topicRepository.create({
      data: {
        title: data.title,
        order: data.order,
        moduleId,
      },
    });
  }

  async getTopicWithContent(topicId: string) {
    const topic = await this.topicRepository.findUnique({
      where: { id: topicId },
      include: {
        contentChunks: { orderBy: { order: 'asc' } },
        materials: { orderBy: { version: 'desc' } },
        questions: { include: { options: { select: { id: true, text: true } } } },
      },
    });
    if (!topic) throw new NotFoundException('Topic not found');
    return topic;
  }

  async addMaterial(topicId: string, data: { filename: string; filePath: string; mimeType: string }) {
    const lastMaterial = await this.materialRepository.findFirst({
      where: { topicId },
      orderBy: { version: 'desc' },
    });

    const version = lastMaterial ? (lastMaterial as any).version + 1 : 1;

    return this.materialRepository.create({
      data: {
        ...data,
        topicId,
        version,
      },
    });
  }

  async getTopicChunks(topicId: string) {
    return this.chunkRepository.findMany({
      where: { topicId },
      orderBy: { order: 'asc' },
    });
  }

  async addContentChunk(topicId: string, data: { content: string; order: number }) {
    return this.chunkRepository.create({
      data: {
        content: data.content,
        order: data.order,
        topicId,
      },
    });
  }

  async deleteContentChunks(topicId: string) {
    return this.chunkRepository.deleteMany({ where: { topicId } });
  }
}
