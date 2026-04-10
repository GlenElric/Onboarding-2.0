import { Controller, Get, Post, Body, Param, Request } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { SubmitQuizDto } from './dto/quiz.dto';

import { Public } from "../auth/public.decorator";
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  /** Admin only: generate quiz questions from AI */
  @Post('generate/:topicId')
  async generate(@Param('topicId') topicId: string) {
    return this.quizService.generateQuizForTopic(topicId);
  }

  /** Learner: fetch questions (no correct answers) */
  @Get(':topicId')
  @Public()
  async getQuiz(@Param('topicId') topicId: string) {
    return this.quizService.getQuizForTopic(topicId);
  }

  /** Learner: submit answers */
  @Post(':topicId/submit')
  async submitQuiz(
    @Param('topicId') topicId: string,
    @Body() dto: SubmitQuizDto,
    @Request() req: any,
  ) {
    return this.quizService.submitQuiz(req.user.userId, topicId, dto.answers);
  }

  /** Learner: get attempt history */
  @Get(':topicId/history')
  async history(@Param('topicId') topicId: string, @Request() req: any) {
    return this.quizService.getQuizHistory(req.user.userId, topicId);
  }
}
