import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class QuizService {
  private aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  constructor(private prisma: PrismaService) {}

  async generateQuizForTopic(topicId: string) {
    const topic = await this.prisma.topic.findUnique({ where: { id: topicId } });
    if (!topic) throw new NotFoundException('Topic not found');

    try {
      const response = await axios.post(`${this.aiServiceUrl}/generate/quiz`, null, {
        params: { topicId },
      });
      const questions: Array<{
        text: string;
        options: Array<{ text: string; isCorrect: boolean; label: string }>;
      }> = response.data.questions;

      // New schema: questions are unique per topic
      await this.prisma.question.deleteMany({ where: { topicId } });

      for (const q of questions) {
        await this.prisma.question.create({
          data: {
            stem: q.text,
            topicId,
            options: {
              create: q.options.map((o) => ({
                optionText: o.text,
                optionLabel: o.label || 'A',
                isCorrect: o.isCorrect,
              })),
            },
          },
        });
      }

      return { message: 'Quiz generated', count: questions.length };
    } catch (e: any) {
      throw new HttpException(
        e.response?.data?.detail || 'AI service error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getQuizForTopic(topicId: string) {
    return this.prisma.question.findMany({
      where: { topicId },
      include: {
        options: {
          select: { id: true, optionText: true, optionLabel: true },
        },
      },
    });
  }

  async submitQuiz(userId: string, topicId: string, answers: Array<{ questionId: string; selectedOptionId: string }>) {
    const topicProgress = await this.prisma.learnerTopicProgress.findFirst({
        where: { userId, topicId },
        include: { enrollment: { include: { courseVersion: true } } }
    });
    if (!topicProgress) throw new NotFoundException('Topic progress not found');

    const questions = await this.prisma.question.findMany({
      where: { topicId },
      include: { options: true },
    });

    if (questions.length === 0) throw new NotFoundException('No questions found');

    let correct = 0;
    for (const answer of answers) {
      const question = questions.find((q) => q.id === answer.questionId);
      const selectedOption = question?.options.find((o) => o.id === answer.selectedOptionId);
      if (selectedOption?.isCorrect) correct++;
    }

    const score = (correct / questions.length) * 100;
    const threshold = topicProgress.enrollment.courseVersion.passThresholdPercent;
    const passed = score >= threshold;

    const attempt = await this.prisma.quizAttempt.create({
      data: {
        progress: { connect: { id: topicProgress.id } },
        attemptNo: topicProgress.attemptsUsed + 1,
        scorePercent: score,
        totalQuestions: questions.length,
        correctAnswers: correct,
        thresholdPercent: threshold,
        passed,
        status: 'SUBMITTED',
        startedAt: new Date(),
        submittedAt: new Date(),
      },
    });

    await this.prisma.learnerTopicProgress.update({
        where: { id: topicProgress.id },
        data: {
            attemptsUsed: { increment: 1 },
            status: passed ? 'PASSED' : 'FAILED',
            passedAt: passed ? new Date() : undefined,
        }
    });

    return { attemptId: attempt.id, score, passed };
  }

  async getQuizHistory(userId: string, topicId: string) {
    const topicProgress = await this.prisma.learnerTopicProgress.findFirst({
        where: { userId, topicId }
    });
    if (!topicProgress) return [];

    return this.prisma.quizAttempt.findMany({
      where: { learnerTopicProgressId: topicProgress.id },
      orderBy: { createdAt: 'desc' },
    });
  }
}
