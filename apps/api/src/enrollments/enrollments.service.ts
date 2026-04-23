import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async enroll(userId: string, courseId: string) {
    const existing = await this.prisma.courseEnrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (existing) throw new ConflictException('Already enrolled');

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { modules: { include: { topics: true } } },
    });
    if (!course) throw new NotFoundException('Course not found');

    // Create enrollment and seed all topic progress as "locked"
    const enrollment = await this.prisma.courseEnrollment.create({
      data: { userId, courseId },
    });

    const allTopics = course.modules.flatMap((m) => m.topics);
    if (allTopics.length > 0) {
      // Unlock first topic
      const [first, ...rest] = allTopics;
      await this.prisma.topicProgress.createMany({
        data: [
          { enrollmentId: enrollment.id, topicId: first.id, status: 'unlocked' },
          ...rest.map((t) => ({ enrollmentId: enrollment.id, topicId: t.id, status: 'locked' })),
        ],
      });
    }

    return enrollment;
  }

  async getMyEnrollments(userId: string) {
    return this.prisma.courseEnrollment.findMany({
      where: { userId },
      include: {
        course: { include: { modules: { include: { topics: true } } } },
        topicProgress: true,
      },
    });
  }

  async getCourseProgress(userId: string, courseId: string) {
    const enrollment = await this.prisma.courseEnrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      include: {
        course: {
          include: {
            modules: {
              orderBy: { order: 'asc' },
              include: {
                topics: { orderBy: { order: 'asc' } },
              },
            },
          },
        },
        topicProgress: true,
      },
    });
    if (!enrollment) throw new NotFoundException('Not enrolled in this course');
    return enrollment;
  }

  async completeTopicAndUnlockNext(userId: string, topicId: string) {
    // Find enrollment that contains this topic
    const topic = await this.prisma.topic.findUnique({
      where: { id: topicId },
      include: { module: { include: { course: true, topics: { orderBy: { order: 'asc' } } } } },
    });
    if (!topic) throw new NotFoundException('Topic not found');

    const enrollment = await this.prisma.courseEnrollment.findUnique({
      where: { userId_courseId: { userId, courseId: topic.module.courseId } },
    });
    if (!enrollment) throw new NotFoundException('Not enrolled');

    // Mark current topic as completed
    await this.prisma.topicProgress.updateMany({
      where: { enrollmentId: enrollment.id, topicId },
      data: { status: 'completed' },
    });

    // Find next topic in same module or next module's first topic
    const currentModuleTopics = topic.module.topics;
    const currentIdx = currentModuleTopics.findIndex((t) => t.id === topicId);
    const nextTopicInModule = currentModuleTopics[currentIdx + 1];

    if (nextTopicInModule) {
      await this.prisma.topicProgress.updateMany({
        where: { enrollmentId: enrollment.id, topicId: nextTopicInModule.id },
        data: { status: 'unlocked' },
      });
    }

    return { message: 'Topic completed', nextTopicId: nextTopicInModule?.id ?? null };
  }
}
