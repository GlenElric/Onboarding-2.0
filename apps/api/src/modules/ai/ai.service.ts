import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class AiService {
  private aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  constructor(private prisma: PrismaService) {}

  async chat(userId: string, topicId: string, content: string) {
    // 1. Fetch context chunks from DB
    const chunks = await this.prisma.contentChunk.findMany({
      where: { topicId },
      orderBy: { order: 'asc' },
    });

    const context = chunks.map(c => c.content).join('\n\n');

    // 2. Call FastAPI for RAG response
    const response = await axios.post(`${this.aiServiceUrl}/generate/chat`, {
      context,
      message: content,
    });

    // 3. Store message in history (optional implementation)
    // For now, return response directly
    return {
      response: response.data.answer,
      citations: response.data.citations,
    };
  }
}
