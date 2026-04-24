<<<<<<< HEAD
import { Injectable, Logger } from '@nestjs/common';
import { CoursesService } from '../courses/courses.service';
import axios from 'axios';
import { FormData } from 'formdata-node';
@Injectable()
export class ContentService {
  private readonly logger = new Logger(ContentService.name);
  private aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  constructor(
=======
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CoursesService } from '../courses/courses.service';

@Injectable()
export class ContentService {
  constructor(
    @InjectQueue('content-processing') private contentQueue: Queue,
>>>>>>> 9f26dcfb01a1ac0abbcb0c4a05ebd7066e032a05
    private coursesService: CoursesService,
  ) {}

  async processPdf(topicId: string, file: Express.Multer.File, userId: string) {
    const material = await this.coursesService.addMaterial(topicId, {
      filename: file.originalname,
      filePath: `uploads/${file.originalname}`,
      mimeType: file.mimetype,
    });

<<<<<<< HEAD
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
=======
    await this.contentQueue.add('process-pdf', {
      topicId,
      materialId: material.id,
      fileBuffer: file.buffer,
      fileName: file.originalname,
      userId,
    });

    return { message: 'PDF processing started', materialId: material.id };
>>>>>>> 9f26dcfb01a1ac0abbcb0c4a05ebd7066e032a05
  }
}
