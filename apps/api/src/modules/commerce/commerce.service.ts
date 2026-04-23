import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto, VerifyPaymentDto } from './dto/payment.dto';
import * as crypto from 'crypto';

@Injectable()
export class CommerceService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: string, data: CreateOrderDto) {
    const course = await this.prisma.course.findUnique({
      where: { id: data.courseId },
    });

    if (!course) throw new BadRequestException('Course not found');
    if (course.price <= 0) return { message: 'Course is free', free: true };

    // Here you would call Razorpay/Stripe API to create an order
    // const razorpayOrder = await razorpay.orders.create({ amount: course.price * 100, currency: 'INR' });
    const providerOrderId = `order_${Math.random().toString(36).substring(7)}`;

    const payment = await this.prisma.payment.create({
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
    const payment = await this.prisma.payment.findUnique({
      where: { providerOrderId: data.razorpay_order_id },
    });

    if (!payment) throw new BadRequestException('Payment record not found');

    // Secure verification of Razorpay signature
    const secret = process.env.RAZORPAY_SECRET;
    if (!secret) {
      throw new InternalServerErrorException('Payment provider secret not configured');
    }

    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(data.razorpay_order_id + '|' + data.razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== data.razorpay_signature) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'failed' },
      });
      throw new BadRequestException('Invalid payment signature');
    }

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'completed',
        providerPaymentId: data.razorpay_payment_id,
      },
    });

    // Automatically enroll user after payment
    await this.prisma.courseEnrollment.upsert({
      where: { userId_courseId: { userId, courseId: payment.courseId } },
      update: {},
      create: { userId, courseId: payment.courseId },
    });

    return { success: true };
  }
}
