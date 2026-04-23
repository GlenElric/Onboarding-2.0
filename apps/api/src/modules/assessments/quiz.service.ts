import { Injectable, HttpException, HttpStatus, NotFoundException, Logger } from '@nestjs/common';
import { QuestionRepository } from '../../repositories/question.repository';
import { QuizAttemptRepository } from '../../repositories/quiz-attempt.repository';
import { TopicRepository } from '../../repositories/topic.repository';
import { PrismaService } from '../../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class QuizService {
  private readonly logger = new Logger(QuizService.name);
  private aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  constructor(
    private questionRepository: QuestionRepository,
    private quizAttemptRepository: QuizAttemptRepository,
    private topicRepository: TopicRepository,
    private prisma: PrismaService,
  ) {}

  async generateQuizForTopic(topicId: string) {
    const topic = await this.topicRepository.findUnique({ where: { id: topicId } });
    if (!topic) throw new NotFoundException('Topic not found');

    this.logger.log(`Generating quiz for topic: ${topicId}`);

    try {
      const response = await axios.post(`${this.aiServiceUrl}/generate/quiz`, null, {
        params: { topicId },
      });
      const questions: Array<{
        text: string;
        options: Array<{ text: string; isCorrect: boolean }>;
      }> = response.data.questions;

      // Atomic update: Delete old and insert new within a transaction (simulated here)
      const oldQuestions = await this.questionRepository.findMany({ where: { topicId } });
      for (const q of oldQuestions) {
        await this.prisma.questionOption.deleteMany({ where: { questionId: q.id } });
      }
      await this.questionRepository.deleteMany({ where: { topicId } });

      for (const q of questions) {
        const created = await this.questionRepository.create({
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

      this.logger.log(`Generated ${questions.length} questions for topic: ${topicId}`);
      return { message: 'Quiz generated', count: questions.length };
    } catch (e: any) {
      this.logger.error(`AI service error during quiz generation: ${e.message}`);
      throw new HttpException(
        e.response?.data?.detail || 'AI service error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getQuizForTopic(topicId: string) {
    const questions = await this.questionRepository.findMany({
      where: { topicId },
      include: {
        options: {
          select: { id: true, text: true },
        },
      },
    });
    return questions;
  }

  async submitQuiz(userId: string, topicId: string, answers: Array<{ questionId: string; selectedOptionId: string }>) {
    const questions = (await this.questionRepository.findMany({
      where: { topicId },
      include: { options: true },
    })) as any[];

    if (questions.length === 0) throw new NotFoundException('No questions found for this topic');

    let correct = 0;
    const learnerAnswers: Array<{ questionId: string; selectedOption: string; isCorrect: boolean }> = [];

    for (const answer of answers) {
      const question = questions.find((q) => q.id === answer.questionId);
      if (!question) continue;
      const selectedOption = question.options.find((o: any) => o.id === answer.selectedOptionId);
      const isCorrect = selectedOption?.isCorrect ?? false;
      if (isCorrect) correct++;
      learnerAnswers.push({
        questionId: answer.questionId,
        selectedOption: answer.selectedOptionId,
        isCorrect,
      });
    }

    const score = (correct / questions.length) * 100;
    const passed = score >= 70; // 70% threshold

    const attempt = await this.quizAttemptRepository.create({
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

    this.logger.log(`Quiz submitted by user ${userId}. Score: ${score}%, Passed: ${passed}`);
    return { attemptId: attempt.id, score, passed, correct, total: questions.length };
  }

  async getQuizHistory(userId: string, topicId: string) {
    return this.quizAttemptRepository.findMany({
      where: { userId, topicId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
