import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class QuizService {
  private aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  constructor(private prisma: PrismaService) {}

  /** Admin: trigger AI to generate quiz questions for a topic */
  async generateQuizForTopic(topicId: string) {
    const topic = await this.prisma.topic.findUnique({ where: { id: topicId } });
    if (!topic) throw new NotFoundException('Topic not found');

    try {
      const response = await axios.post(`${this.aiServiceUrl}/generate/quiz`, null, {
        params: { topicId },
      });
      const questions: Array<{
        text: string;
        options: Array<{ text: string; isCorrect: boolean }>;
      }> = response.data.questions;

      // Delete old questions for this topic first
      const oldQuestions = await this.prisma.question.findMany({ where: { topicId } });
      for (const q of oldQuestions) {
        await this.prisma.questionOption.deleteMany({ where: { questionId: q.id } });
      }
      await this.prisma.question.deleteMany({ where: { topicId } });

      // Insert new questions
      for (const q of questions) {
        const created = await this.prisma.question.create({
          data: { text: q.text, topicId },
        });
        await this.prisma.questionOption.createMany({
          data: q.options.map((o) => ({
            text: o.text,
            isCorrect: o.isCorrect,
            questionId: created.id,
          })),
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

  /** Learner: get quiz questions for a topic (without correct answers) */
  async getQuizForTopic(topicId: string) {
    const questions = await this.prisma.question.findMany({
      where: { topicId },
      include: {
        options: {
          select: { id: true, text: true }, // Do NOT expose isCorrect
        },
      },
    });
    return questions;
  }

  /** Learner: submit quiz answers and get a score */
  async submitQuiz(userId: string, topicId: string, answers: Array<{ questionId: string; selectedOptionId: string }>) {
    // Fetch questions with correct options
    const questions = await this.prisma.question.findMany({
      where: { topicId },
      include: { options: true },
    });

    if (questions.length === 0) throw new NotFoundException('No questions found for this topic');

    let correct = 0;
    const learnerAnswers: Array<{ questionId: string; selectedOption: string; isCorrect: boolean }> = [];

    for (const answer of answers) {
      const question = questions.find((q) => q.id === answer.questionId);
      if (!question) continue;
      const selectedOption = question.options.find((o) => o.id === answer.selectedOptionId);
      const isCorrect = selectedOption?.isCorrect ?? false;
      if (isCorrect) correct++;
      learnerAnswers.push({
        questionId: answer.questionId,
        selectedOption: answer.selectedOptionId,
        isCorrect,
      });
    }

    const score = (correct / questions.length) * 100;
    const passed = score >= 70;

    const attempt = await this.prisma.quizAttempt.create({
      data: {
        userId,
        topicId,
        score,
        passed,
        answers: {
          create: learnerAnswers,
        },
      },
    });

    return { attemptId: attempt.id, score, passed, correct, total: questions.length };
  }

  /** Get quiz history for a user on a topic */
  async getQuizHistory(userId: string, topicId: string) {
    return this.prisma.quizAttempt.findMany({
      where: { userId, topicId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
