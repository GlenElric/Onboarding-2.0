import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async enroll(userId: string, courseId: string) {
    // Find the latest published version
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        versions: {
          where: { status: 'PUBLISHED' },
          orderBy: { versionNo: 'desc' },
          take: 1,
          include: { modules: { include: { topics: true } } }
        }
      },
    });

    if (!course || course.versions.length === 0) throw new NotFoundException('Course or published version not found');
    const version = course.versions[0];

    const existing = await this.prisma.courseEnrollment.findUnique({
      where: { userId_courseVersionId: { userId, courseVersionId: version.id } },
    });
    if (existing) throw new ConflictException('Already enrolled in this version');

    // Create enrollment
    const enrollment = await this.prisma.courseEnrollment.create({
      data: {
        userId,
        courseId,
        courseVersionId: version.id,
        enrollmentSource: 'FREE_ENROLLMENT'
      },
    });

    const allTopics = version.modules
      .sort((a, b) => a.sequenceNo - b.sequenceNo)
      .flatMap((m) => m.topics.sort((a, b) => a.sequenceNo - b.sequenceNo));

    if (allTopics.length > 0) {
      // Unlock first topic, others locked by default
      for (let i = 0; i < allTopics.length; i++) {
        await this.prisma.learnerTopicProgress.create({
          data: {
            userId,
            courseEnrollmentId: enrollment.id,
            topicId: allTopics[i].id,
            status: i === 0 ? 'NOT_STARTED' : 'NOT_STARTED', // Status updated to NOT_STARTED, logic for locked is separate field
            isLocked: i !== 0,
            sequenceNo: i + 1,
          }
        });
      }
    }

    return enrollment;
  }

  async getMyEnrollments(userId: string) {
    return this.prisma.courseEnrollment.findMany({
      where: { userId },
      include: {
        course: true,
        courseVersion: true,
        topicProgress: true,
      },
    });
  }

  async getCourseProgress(userId: string, courseId: string) {
    const enrollment = await this.prisma.courseEnrollment.findFirst({
      where: { userId, courseId },
      orderBy: { createdAt: 'desc' },
      include: {
        course: true,
        courseVersion: {
          include: {
            modules: {
              orderBy: { sequenceNo: 'asc' },
              include: {
                topics: { orderBy: { sequenceNo: 'asc' } },
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
    const topic = await this.prisma.topic.findUnique({
      where: { id: topicId },
      include: { module: { include: { courseVersion: true } } }
    });
    if (!topic) throw new NotFoundException('Topic not found');

    const enrollment = await this.prisma.courseEnrollment.findUnique({
      where: { userId_courseVersionId: { userId, courseVersionId: topic.module.courseVersionId } },
    });
    if (!enrollment) throw new NotFoundException('Not enrolled');

    // Mark current topic as completed
    await this.prisma.learnerTopicProgress.update({
      where: { userId_courseEnrollmentId_topicId: { userId, courseEnrollmentId: enrollment.id, topicId } },
      data: { status: 'COMPLETED' },
    });

    // Find next topic by sequence
    const currentProgress = await this.prisma.learnerTopicProgress.findUnique({
        where: { userId_courseEnrollmentId_topicId: { userId, courseEnrollmentId: enrollment.id, topicId } }
    });

    const nextTopicProgress = await this.prisma.learnerTopicProgress.findFirst({
        where: {
            courseEnrollmentId: enrollment.id,
            sequenceNo: { gt: currentProgress!.sequenceNo }
        },
        orderBy: { sequenceNo: 'asc' }
    });

    if (nextTopicProgress) {
      await this.prisma.learnerTopicProgress.update({
        where: { id: nextTopicProgress.id },
        data: { isLocked: false },
      });
    }

    return { message: 'Topic completed', nextTopicId: nextTopicProgress?.topicId ?? null };
  }
}
