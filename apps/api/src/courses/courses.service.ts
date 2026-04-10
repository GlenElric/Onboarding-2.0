import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    // Return courses with their latest published version info
    const courses = await this.prisma.course.findMany({
      include: {
        versions: {
          where: { status: 'PUBLISHED' },
          orderBy: { versionNo: 'desc' },
          take: 1,
          include: {
            _count: {
              select: { modules: true },
            }
          }
        },
        _count: {
          select: { enrollments: true },
        },
      },
    });

    // Flatten for frontend ease if needed, but keeping it structured for now
    return courses;
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        versions: {
          orderBy: { versionNo: 'desc' },
          include: {
            modules: {
              orderBy: { sequenceNo: 'asc' },
              include: {
                topics: { orderBy: { sequenceNo: 'asc' } },
              },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    // Return the latest version by default
    const latestVersion = course.versions[0];
    return {
      ...course,
      latestVersion,
    };
  }

  async create(data: any) {
    return this.prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        createdByUserId: data.userId, // Mandatory in new schema
        organizationId: data.organizationId,
      },
    });
  }

  async createVersion(courseId: string, data: any) {
    return this.prisma.courseVersion.create({
      data: {
        courseId,
        versionNo: data.versionNo || 1,
        status: data.status || 'DRAFT',
      }
    });
  }

  async addModule(courseVersionId: string, data: any) {
    return this.prisma.module.create({
      data: {
        title: data.title,
        sequenceNo: data.sequenceNo,
        courseVersionId,
      },
    });
  }

  async addTopic(moduleId: string, data: any) {
    return this.prisma.topic.create({
      data: {
        title: data.title,
        sequenceNo: data.sequenceNo,
        moduleId,
      },
    });
  }

  async getTopicWithContent(topicId: string) {
    const topic = await this.prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        contentChunks: { orderBy: { chunkIndex: 'asc' } },
        topicMaterials: { include: { materialVersion: true } },
        questions: { include: { options: { select: { id: true, optionText: true, optionLabel: true } } } },
      },
    });
    if (!topic) throw new NotFoundException('Topic not found');
    return topic;
  }

  async getTopicChunks(topicId: string) {
    return this.prisma.contentChunk.findMany({
      where: { topicId },
      orderBy: { chunkIndex: 'asc' },
    });
  }

  async addContentChunk(topicId: string, data: { content: string; chunkIndex: number; materialVersionId: string }) {
    return this.prisma.contentChunk.create({
      data: {
        content: data.content,
        chunkIndex: data.chunkIndex,
        chunkType: 'TOPIC', // Default
        topicId,
        materialVersionId: data.materialVersionId,
      },
    });
  }
}
