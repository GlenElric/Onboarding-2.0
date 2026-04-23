import { Injectable, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { PaymentRepository } from '../../repositories/payment.repository';
import { CourseRepository } from '../../repositories/course.repository';
import { EnrollmentRepository } from '../../repositories/enrollment.repository';
import { CreateOrderDto, VerifyPaymentDto } from './dto/payment.dto';
import * as crypto from 'crypto';

@Injectable()
export class CommerceService {
  private readonly logger = new Logger(CommerceService.name);

  constructor(
    private paymentRepository: PaymentRepository,
    private courseRepository: CourseRepository,
    private enrollmentRepository: EnrollmentRepository,
  ) {}

  async createOrder(userId: string, data: CreateOrderDto) {
    const course = await this.courseRepository.findUnique({
      where: { id: data.courseId },
    });

    if (!course) throw new BadRequestException('Course not found');

    this.logger.log(`Creating order for user ${userId} for course ${data.courseId}`);

    if (course.price <= 0) {
      this.logger.log(`Course ${data.courseId} is free. Enrolling user immediately.`);
      await this.enrollmentRepository.upsert({
        where: { userId_courseId: { userId, courseId: course.id } },
        update: {},
        create: { userId, courseId: course.id },
      });
      return { message: 'Course is free', free: true };
    }

    // In production, call Razorpay API here
    const providerOrderId = `order_${Math.random().toString(36).substring(7)}`;

    const payment = await this.paymentRepository.create({
      data: {
        userId,
        courseId: course.id,
        amount: course.price,
        provider: 'razorpay',
        providerOrderId,
        status: 'pending',
      },
    });

    return {
      orderId: providerOrderId,
      amount: course.price,
      currency: 'INR',
      paymentId: payment.id,
    };
  }

  async verifyPayment(userId: string, data: VerifyPaymentDto) {
    const payment = (await this.paymentRepository.findUnique({
      where: { providerOrderId: data.razorpay_order_id },
    })) as any;

    if (!payment) {
      this.logger.error(`Payment verification failed: Order ${data.razorpay_order_id} not found`);
      throw new BadRequestException('Payment record not found');
    }

    if (payment.userId !== userId) {
      this.logger.error(`Payment verification failed: User mismatch. Expected ${payment.userId}, got ${userId}`);
      throw new BadRequestException('Unauthorized payment verification');
    }

    const secret = process.env.RAZORPAY_SECRET;
    if (!secret) {
      this.logger.error('RAZORPAY_SECRET is not configured');
      throw new InternalServerErrorException('Payment provider secret not configured');
    }

    // Server-side HMAC signature verification
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(data.razorpay_order_id + '|' + data.razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== data.razorpay_signature) {
      this.logger.warn(`Invalid payment signature for order ${data.razorpay_order_id}`);
      await this.paymentRepository.update({
        where: { id: payment.id },
        data: { status: 'failed' },
      });
      throw new BadRequestException('Invalid payment signature');
    }

    this.logger.log(`Payment verified successfully for order ${data.razorpay_order_id}`);

    await this.paymentRepository.update({
      where: { id: payment.id },
      data: {
        status: 'completed',
        providerPaymentId: data.razorpay_payment_id,
      },
    });

    // Automatically enroll user after verified payment
    await this.enrollmentRepository.upsert({
      where: { userId_courseId: { userId, courseId: payment.courseId } },
      update: {},
      create: { userId, courseId: payment.courseId },
    });

    return { success: true };
  }
}
