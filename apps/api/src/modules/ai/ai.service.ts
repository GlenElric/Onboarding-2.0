import { Injectable, Logger } from '@nestjs/common';
import { ContentChunkRepository } from '../../repositories/content-chunk.repository';
import axios from 'axios';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  constructor(private chunkRepository: ContentChunkRepository) {}

  async chat(userId: string, topicId: string, content: string) {
    this.logger.log(`AI Chat request for user ${userId} on topic ${topicId}`);

    // 1. Fetch context chunks from DB - limited to most relevant or all for small topics
    const chunks = await this.chunkRepository.findMany({
      where: { topicId },
      orderBy: { order: 'asc' },
      take: 20, // Avoid pushing too much context if not using vector search yet
    });

    const context = chunks.map(c => c.content).join('\n\n');

    try {
      // 2. Call FastAPI for RAG response
      const response = await axios.post(`${this.aiServiceUrl}/generate/chat`, {
        context,
        message: content,
      });

      // FastAPI returns structured JSON with 'answer' and 'citations'
      // Gemini response might be wrapped in a string if not parsed correctly by FastAPI
      let data = response.data;
      if (typeof data === 'string') {
          try {
              data = JSON.parse(data);
          } catch (e) {
              data = { answer: data, citations: [] };
          }
      }

      this.logger.log(`AI Chat response generated with ${data.citations?.length || 0} citations`);

      return {
        response: data.answer,
        citations: data.citations || [],
      };
    } catch (error) {
      this.logger.error(`Error in AI Tutor chat: ${error.message}`);
      return {
        response: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        citations: []
      };
    }
  }
}
