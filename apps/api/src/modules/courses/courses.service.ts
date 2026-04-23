import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseRepository } from '../../repositories/course.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';

@Injectable()
export class CoursesService {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly prisma: PrismaService,
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
    return this.prisma.module.create({
      data: {
        title: data.title,
        order: data.order,
        courseId,
      },
    });
  }

  async addTopic(moduleId: string, data: any) {
    return this.prisma.topic.create({
      data: {
        title: data.title,
        order: data.order,
        moduleId,
      },
    });
  }

  async getTopicWithContent(topicId: string) {
    const topic = await this.prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        contentChunks: { orderBy: { order: 'asc' } },
        materials: true,
        questions: { include: { options: { select: { id: true, text: true } } } },
      },
    });
    if (!topic) throw new NotFoundException('Topic not found');
    return topic;
  }

  async getTopicChunks(topicId: string) {
    return this.prisma.contentChunk.findMany({
      where: { topicId },
      orderBy: { order: 'asc' },
    });
  }

  async addContentChunk(topicId: string, data: { content: string; order: number }) {
    return this.prisma.contentChunk.create({
      data: {
        content: data.content,
        order: data.order,
        topicId,
      },
    });
  }

  async deleteContentChunks(topicId: string) {
    return this.prisma.contentChunk.deleteMany({ where: { topicId } });
  }
}
