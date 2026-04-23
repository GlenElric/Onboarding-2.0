import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { QuestionRepository } from '../../repositories/question.repository';
import { QuizAttemptRepository } from '../../repositories/quiz-attempt.repository';
import { TopicRepository } from '../../repositories/topic.repository';

@Module({
  controllers: [QuizController],
  providers: [
    QuizService,
    QuestionRepository,
    QuizAttemptRepository,
    TopicRepository,
  ],
  exports: [QuizService],
})
export class QuizModule {}
