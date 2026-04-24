import { Controller, Post, Body, Req } from '@nestjs/common';
import { AiService } from './ai.service';
import { ChatRequestDto } from './dto/chat.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(@Req() req: any, @Body() data: ChatRequestDto) {
    return this.aiService.chat(req.user.id, data.topicId, data.message);
  }
}
