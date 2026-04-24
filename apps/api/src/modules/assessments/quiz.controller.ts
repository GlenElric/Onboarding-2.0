import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { SubmitQuizDto } from './dto/quiz.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { PlatformRole } from '@prisma/client';

@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Roles(PlatformRole.PLATFORM_ADMIN)
  @Post('topic/:topicId/generate')
  async generate(@Param('topicId') topicId: string) {
    return this.quizService.generateQuizForTopic(topicId);
  }

  @Get('topic/:topicId')
  async getQuiz(@Param('topicId') topicId: string) {
    return this.quizService.getQuizForTopic(topicId);
  }

  @Post('topic/:topicId/submit')
  async submit(@Req() req: any, @Param('topicId') topicId: string, @Body() data: SubmitQuizDto) {
    return this.quizService.submitQuiz(req.user.id, topicId, data.answers);
  }

  @Get('topic/:topicId/history')
  async getHistory(@Req() req: any, @Param('topicId') topicId: string) {
    return this.quizService.getQuizHistory(req.user.id, topicId);
  }
}
