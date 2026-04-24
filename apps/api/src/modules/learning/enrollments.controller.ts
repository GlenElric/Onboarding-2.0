import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollDto } from './dto/enrollment.dto';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  async enroll(@Req() req: any, @Body() data: EnrollDto) {
    return this.enrollmentsService.enroll(req.user.userId, data.courseId);
  }

  @Get('my')
  async getMyEnrollments(@Req() req: any) {
    return this.enrollmentsService.getMyEnrollments(req.user.userId);
  }

  @Get('course/:courseId')
  async getCourseProgress(@Req() req: any, @Param('courseId') courseId: string) {
    return this.enrollmentsService.getCourseProgress(req.user.userId, courseId);
  }

  @Post('topics/:topicId/complete')
  async completeTopic(@Req() req: any, @Param('topicId') topicId: string) {
    return this.enrollmentsService.completeTopicAndUnlockNext(req.user.userId, topicId);
  }
}
