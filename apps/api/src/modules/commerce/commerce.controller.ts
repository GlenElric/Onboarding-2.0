import { Controller, Post, Body, Request } from '@nestjs/common';
import { CommerceService } from './commerce.service';
import { CreateOrderDto, VerifyPaymentDto } from './dto/payment.dto';

@Controller('commerce')
export class CommerceController {
  constructor(private readonly commerceService: CommerceService) {}

  @Post('order')
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.commerceService.createOrder(req.user.id, createOrderDto);
  }

  @Post('verify')
  async verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto, @Request() req) {
    return this.commerceService.verifyPayment(req.user.id, verifyPaymentDto);
  }
}
