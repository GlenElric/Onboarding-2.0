import { Controller, Post, Body, Req } from '@nestjs/common';
import { CommerceService } from './commerce.service';
import { CreateOrderDto, VerifyPaymentDto } from './dto/payment.dto';

@Controller('commerce')
export class CommerceController {
  constructor(private readonly commerceService: CommerceService) {}

  @Post('orders')
  async createOrder(@Req() req: any, @Body() data: CreateOrderDto) {
    return this.commerceService.createOrder(req.user.id, data);
  }

  @Post('verify')
  async verifyPayment(@Req() req: any, @Body() data: VerifyPaymentDto) {
    return this.commerceService.verifyPayment(req.user.id, data);
  }
}
