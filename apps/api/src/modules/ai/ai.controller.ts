import { Controller, Post, Body, Request } from '@nestjs/common';
import { AiService } from './ai.service';
import { ChatMessageDto } from './dto/ai.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(@Body() chatDto: ChatMessageDto, @Request() req) {
    return this.aiService.chat(req.user.id, chatDto.topicId, chatDto.content);
  }
}
