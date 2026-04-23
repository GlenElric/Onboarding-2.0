import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CoursesService } from '../courses/courses.service';

@Injectable()
export class ContentService {
  constructor(
    @InjectQueue('content-processing') private contentQueue: Queue,
    private coursesService: CoursesService,
  ) {}

  async processPdf(topicId: string, file: Express.Multer.File, userId: string) {
    const material = await this.coursesService.addMaterial(topicId, {
      filename: file.originalname,
      filePath: `uploads/${file.originalname}`,
      mimeType: file.mimetype,
    });

    await this.contentQueue.add('process-pdf', {
      topicId,
      materialId: material.id,
      fileBuffer: file.buffer,
      fileName: file.originalname,
      userId,
    });

    return { message: 'PDF processing started', materialId: material.id };
  }
}
