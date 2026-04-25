import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { EnrollmentRepository } from '../../repositories/enrollment.repository';
import { TopicProgressRepository } from '../../repositories/topic-progress.repository';
import { CourseRepository } from '../../repositories/course.repository';
import { TopicRepository } from '../../repositories/topic.repository';

@Injectable()
export class EnrollmentsService {
  private readonly logger = new Logger(EnrollmentsService.name);

  constructor(
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly topicProgressRepository: TopicProgressRepository,
    private readonly courseRepository: CourseRepository,
    private readonly topicRepository: TopicRepository,
  ) {}

  async enroll(userId: string, courseId: string) {
    const existing = await this.enrollmentRepository.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (existing) {
      this.logger.warn(`User ${userId} already enrolled in course ${courseId}`);
      throw new ConflictException('Already enrolled');
    }

    const course = (await this.courseRepository.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: { topics: { orderBy: { order: 'asc' } } }
        }
      },
    })) as any;
    if (!course) throw new NotFoundException('Course not found');

    // RBAC check: only Public courses can be self-enrolled
    if (course.visibility !== 'Public') {
      this.logger.warn(`User ${userId} tried to self-enroll in private course ${courseId}`);
      throw new ConflictException('This course requires administrator assignment');
    }

    const enrollment = await this.enrollmentRepository.create({
      data: { userId, courseId },
    });

    const allTopics = course.modules.flatMap((m: any) => m.topics);
    if (allTopics.length > 0) {
      const [first, ...rest] = allTopics;
      await this.topicProgressRepository.createMany({
        data: [
          { enrollmentId: enrollment.id, topicId: first.id, status: 'unlocked' },
          ...rest.map((t: any) => ({ enrollmentId: enrollment.id, topicId: t.id, status: 'locked' })),
        ],
      });
    }

    this.logger.log(`User ${userId} enrolled in course ${courseId}`);
    return enrollment;
  }

  async getMyEnrollments(userId: string) {
    return this.enrollmentRepository.findMany({
      where: { userId },
      include: {
        course: { include: { modules: { include: { topics: true } } } },
        topicProgress: true,
      },
    });
  }

  async getCourseProgress(userId: string, courseId: string) {
    const enrollment = await this.enrollmentRepository.findUnique({
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
    const topic = (await this.topicRepository.findUnique({
      where: { id: topicId },
      include: { module: { include: { course: true, topics: { orderBy: { order: 'asc' } } } } },
    })) as any;
    if (!topic) throw new NotFoundException('Topic not found');

    const enrollment = (await this.enrollmentRepository.findUnique({
      where: { userId_courseId: { userId, courseId: topic.module.courseId } },
    })) as any;
    if (!enrollment) throw new NotFoundException('Not enrolled');

    // Idempotent update for current topic
    await this.topicProgressRepository.upsert({
      where: {
        enrollmentId_topicId: { enrollmentId: enrollment.id, topicId }
      },
      update: { status: 'completed' },
      create: { enrollmentId: enrollment.id, topicId, status: 'completed' },
    });

    const currentModuleTopics = topic.module.topics;
    const currentIdx = currentModuleTopics.findIndex((t: any) => t.id === topicId);
    const nextTopicInModule = currentModuleTopics[currentIdx + 1];

    if (nextTopicInModule) {
      await this.unlockTopic(enrollment.id, nextTopicInModule.id);
      return { message: 'Topic completed', nextTopicId: nextTopicInModule.id };
    } else {
      // Find next module
      const modules = await this.prisma.module.findMany({
        where: { courseId: topic.module.courseId },
        orderBy: { order: 'asc' },
        include: { topics: { orderBy: { order: 'asc' } } },
      });

      const currentModuleIdx = modules.findIndex((m: any) => m.id === topic.moduleId);
      const nextModule = modules[currentModuleIdx + 1];

      if (nextModule && nextModule.topics.length > 0) {
        await this.unlockTopic(enrollment.id, nextModule.topics[0].id);
        return { message: 'Module completed', nextTopicId: nextModule.topics[0].id };
      }
    }

    return { message: 'Course completed', nextTopicId: null };
  }

  private async unlockTopic(enrollmentId: string, topicId: string) {
    const progress = await this.topicProgressRepository.findUnique({
      where: { enrollmentId_topicId: { enrollmentId, topicId } }
    });

    if (!progress || progress.status === 'locked') {
       await this.topicProgressRepository.upsert({
         where: { enrollmentId_topicId: { enrollmentId, topicId } },
         update: { status: 'unlocked' },
         create: { enrollmentId, topicId, status: 'unlocked' },
       });
    }
  }

  // Add this getter to access prisma from service if needed, though using repository is preferred.
  private get prisma() {
    return (this.enrollmentRepository as any).prisma;
  }
}
