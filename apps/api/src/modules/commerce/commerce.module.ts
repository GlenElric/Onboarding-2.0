import { Module } from '@nestjs/common';
import { CommerceService } from './commerce.service';
import { CommerceController } from './commerce.controller';
import { PaymentRepository } from '../../repositories/payment.repository';
import { CourseRepository } from '../../repositories/course.repository';
import { EnrollmentRepository } from '../../repositories/enrollment.repository';

@Module({
  controllers: [CommerceController],
  providers: [
    CommerceService,
    PaymentRepository,
    CourseRepository,
    EnrollmentRepository,
  ],
  exports: [CommerceService],
})
export class CommerceModule {}
