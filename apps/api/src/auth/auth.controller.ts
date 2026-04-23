import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() data: any) {
    return this.authService.signup(data);
  }

  @Post('login')
  async login(@Body() data: any) {
    return this.authService.login(data);
  }
}
