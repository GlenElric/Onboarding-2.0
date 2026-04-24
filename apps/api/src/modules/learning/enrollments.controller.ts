import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollDto } from './dto/enrollment.dto';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  async enroll(@Req() req: any, @Body() data: EnrollDto) {
<<<<<<< HEAD
    return this.enrollmentsService.enroll(req.user.userId, data.courseId);
=======
    return this.enrollmentsService.enroll(req.user.id, data.courseId);
>>>>>>> 9f26dcfb01a1ac0abbcb0c4a05ebd7066e032a05
  }

  @Get('my')
  async getMyEnrollments(@Req() req: any) {
<<<<<<< HEAD
    return this.enrollmentsService.getMyEnrollments(req.user.userId);
=======
    return this.enrollmentsService.getMyEnrollments(req.user.id);
>>>>>>> 9f26dcfb01a1ac0abbcb0c4a05ebd7066e032a05
  }

  @Get('course/:courseId')
  async getCourseProgress(@Req() req: any, @Param('courseId') courseId: string) {
<<<<<<< HEAD
    return this.enrollmentsService.getCourseProgress(req.user.userId, courseId);
=======
    return this.enrollmentsService.getCourseProgress(req.user.id, courseId);
>>>>>>> 9f26dcfb01a1ac0abbcb0c4a05ebd7066e032a05
  }

  @Post('topics/:topicId/complete')
  async completeTopic(@Req() req: any, @Param('topicId') topicId: string) {
<<<<<<< HEAD
    return this.enrollmentsService.completeTopicAndUnlockNext(req.user.userId, topicId);
=======
    return this.enrollmentsService.completeTopicAndUnlockNext(req.user.id, topicId);
>>>>>>> 9f26dcfb01a1ac0abbcb0c4a05ebd7066e032a05
  }
}
