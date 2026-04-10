import { Controller, Post, Get, Param, Request } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post(':courseId')
  async enroll(@Param('courseId') courseId: string, @Request() req: any) {
    return this.enrollmentsService.enroll(req.user.userId, courseId);
  }

  @Get('my')
  async getMyEnrollments(@Request() req: any) {
    return this.enrollmentsService.getMyEnrollments(req.user.userId);
  }

  @Get(':courseId/progress')
  async getCourseProgress(@Param('courseId') courseId: string, @Request() req: any) {
    return this.enrollmentsService.getCourseProgress(req.user.userId, courseId);
  }

  @Post('topics/:topicId/complete')
  async completeTopic(@Param('topicId') topicId: string, @Request() req: any) {
    return this.enrollmentsService.completeTopicAndUnlockNext(req.user.userId, topicId);
  }
}
