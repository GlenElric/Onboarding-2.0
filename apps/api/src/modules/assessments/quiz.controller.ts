import { Controller, Post, Get, Body, Param, Request } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { SubmitQuizDto } from './dto/quiz.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { PlatformRole } from '@prisma/client';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Roles(PlatformRole.PLATFORM_ADMIN)
  @Post('generate/:topicId')
  async generate(@Param('topicId') topicId: string) {
    return this.quizService.generateQuizForTopic(topicId);
  }

  @Get('topic/:topicId')
  async getQuiz(@Param('topicId') topicId: string) {
    return this.quizService.getQuizForTopic(topicId);
  }

  @Post('submit/:topicId')
  async submit(
    @Param('topicId') topicId: string,
    @Body() submitQuizDto: SubmitQuizDto,
    @Request() req,
  ) {
    return this.quizService.submitQuiz(req.user.id, topicId, submitQuizDto.answers);
  }

  @Get('history/:topicId')
  async getHistory(@Param('topicId') topicId: string, @Request() req) {
    return this.quizService.getQuizHistory(req.user.id, topicId);
  }
}
