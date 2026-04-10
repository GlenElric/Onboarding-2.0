import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clean up
  await prisma.auditLog.deleteMany({});
  await prisma.mentorReview.deleteMany({});
  await prisma.escalation.deleteMany({});
  await prisma.chatMessageCitations.deleteMany({});
  await prisma.chatMessages.deleteMany({});
  await prisma.chatThreads.deleteMany({});
  await prisma.remediationSession.deleteMany({});
  await prisma.learnerAnswers.deleteMany({});
  await prisma.quizAttemptQuestions.deleteMany({});
  await prisma.quizAttempt.deleteMany({});
  await prisma.questionValidation.deleteMany({});
  await prisma.questionSourceChunk.deleteMany({});
  await prisma.questionOption.deleteMany({});
  await prisma.question.deleteMany({});
  await prisma.questionGenerationJob.deleteMany({});
  await prisma.studySession.deleteMany({});
  await prisma.learnerTopicProgress.deleteMany({});
  await prisma.learnerCourseProgress.deleteMany({});
  await prisma.courseEnrollment.deleteMany({});
  await prisma.courseAssignmentRule.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.coursePrice.deleteMany({});
  await prisma.contentChunk.deleteMany({});
  await prisma.topicMaterial.deleteMany({});
  await prisma.materialVersion.deleteMany({});
  await prisma.material.deleteMany({});
  await prisma.topic.deleteMany({});
  await prisma.module.deleteMany({});
  await prisma.courseVersion.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.organizationSubscription.deleteMany({});
  await prisma.invitation.deleteMany({});
  await prisma.employeeProfile.deleteMany({});
  await prisma.jobRole.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.organizationMembership.deleteMany({});
  await prisma.organization.deleteMany({});
  await prisma.learnerProfile.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Database cleaned.');

  // Create Platform Admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@auralearning.com',
      passwordHash: hashedPassword,
      firstName: 'Aura',
      lastName: 'Admin',
      globalRole: 'PLATFORM_ADMIN',
    },
  });

  // Create Organization
  const org = await prisma.organization.create({
    data: {
      name: 'Cognitive Corp',
      code: 'COG',
      type: 'COMPANY',
    },
  });

  // Admin Org Membership
  await prisma.organizationMembership.create({
    data: {
      organizationId: org.id,
      userId: admin.id,
      role: 'ORG_ADMIN',
    },
  });

  // Create Course
  const course = await prisma.course.create({
    data: {
      organizationId: org.id,
      title: 'Introduction to AI Architectures',
      description: 'Learn the fundamentals of modern AI systems.',
      createdByUserId: admin.id,
      code: 'AI-101',
    },
  });

  // Create Course Version
  const version = await prisma.courseVersion.create({
    data: {
      courseId: course.id,
      versionNo: 1,
      status: 'PUBLISHED',
      publishedByUserId: admin.id,
      publishedAt: new Date(),
    },
  });

  // Create Module
  const module = await prisma.module.create({
    data: {
      courseVersionId: version.id,
      title: 'Foundations of Neural Networks',
      sequenceNo: 1,
    },
  });

  // Create Topic
  const topic = await prisma.topic.create({
    data: {
      moduleId: module.id,
      title: 'Perceptrons and Backpropagation',
      sequenceNo: 1,
      learningObjectives: 'Understand the basic unit of a neural network.',
    },
  });

  // Create Content Chunks for Topic
  await prisma.material.create({
    data: {
      id: 'mock-material-id',
      organizationId: org.id,
      title: 'AI Fundamentals PDF',
      materialType: 'PDF',
      createdByUserId: admin.id,
      versions: {
        create: {
          id: 'mock-version-id',
          versionNo: 1,
          status: 'PUBLISHED',
          uploadedByUserId: admin.id,
          contentChunks: {
            create: [
              {
                topicId: topic.id,
                chunkIndex: 1,
                chunkType: 'TOPIC',
                content: 'A perceptron is an algorithm for supervised learning of binary classifiers.',
              },
              {
                topicId: topic.id,
                chunkIndex: 2,
                chunkType: 'TOPIC',
                content: 'Backpropagation is a method used in artificial neural networks to calculate a gradient that is needed in the calculation of the weights to be used in the network.',
              }
            ]
          }
        }
      }
    }
  });

  // Create Questions
  await prisma.question.create({
    data: {
      topicId: topic.id,
      stem: 'What is the primary function of a perceptron?',
      options: {
        create: [
          { optionLabel: 'A', optionText: 'Binary classification', isCorrect: true },
          { optionLabel: 'B', optionText: 'Generating images', isCorrect: false },
          { optionLabel: 'C', optionText: 'Storing hard drives', isCorrect: false },
        ]
      }
    }
  });

  console.log('Seed successful!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
