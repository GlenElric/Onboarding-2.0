import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../../prisma/prisma.service';
import { FormData } from 'formdata-node';
import { Blob } from 'buffer';

@Processor('content-processing')
export class ContentProcessor extends WorkerHost {
  private readonly logger = new Logger(ContentProcessor.name);
  private aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);

    if (job.name === 'process-pdf') {
      const { topicId, fileBuffer, fileName } = job.data;

      try {
        const formData = new FormData();
        const blob = new Blob([Buffer.from(fileBuffer)]);
        formData.append('file', blob, fileName);

        const response = await axios.post(
          `${this.aiServiceUrl}/process/pdf`,
          formData,
          {
            params: { topicId },
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        this.logger.log(`AI Service response: ${JSON.stringify(response.data)}`);

        // The AI service in this MVP implementation calls back the API to store chunks.
        // In a more robust implementation, we might handle chunks here.

        return response.data;
      } catch (error) {
        this.logger.error(`Error processing PDF: ${error.message}`);
        throw error;
      }
    }
  }
}
