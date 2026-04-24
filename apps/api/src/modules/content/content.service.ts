import { Injectable, Logger } from '@nestjs/common';
import { CoursesService } from '../courses/courses.service';
import axios from 'axios';
import { FormData } from 'formdata-node';
@Injectable()
export class ContentService {
  private readonly logger = new Logger(ContentService.name);
  private aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  constructor(
    private coursesService: CoursesService,
  ) {}

  async processPdf(topicId: string, file: Express.Multer.File, userId: string) {
    const material = await this.coursesService.addMaterial(topicId, {
      filename: file.originalname,
      filePath: `uploads/${file.originalname}`,
      mimeType: file.mimetype,
    });

    try {
      const formData = new FormData();
      const blob = new Blob([Buffer.from(file.buffer)]);
      formData.append('file', blob, file.originalname);

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
      
      return { message: 'PDF processed successfully', materialId: material.id, data: response.data };
    } catch (error) {
      this.logger.error(`Error processing PDF: ${error.message}`);
      return { message: 'Failed to process PDF', materialId: material.id, error: error.message };
    }
  }
}
