import { Controller, Post, Get, Param, Request } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post('course/:courseId')
  async enroll(@Param('courseId') courseId: string, @Request() req) {
    return this.enrollmentsService.enroll(req.user.id, courseId);
  }

  @Get('my')
  async getMyEnrollments(@Request() req) {
    return this.enrollmentsService.getMyEnrollments(req.user.id);
  }

  @Get('course/:courseId/progress')
  async getCourseProgress(@Param('courseId') courseId: string, @Request() req) {
    return this.enrollmentsService.getCourseProgress(req.user.id, courseId);
  }

  @Post('topic/:topicId/complete')
  async completeTopic(@Param('topicId') topicId: string, @Request() req) {
    return this.enrollmentsService.completeTopicAndUnlockNext(req.user.id, topicId);
  }
}
