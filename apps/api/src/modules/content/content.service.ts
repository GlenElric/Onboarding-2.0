import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ContentService {
  constructor(
    @InjectQueue('content-processing') private contentQueue: Queue,
    private prisma: PrismaService,
  ) {}

  async processPdf(topicId: string, file: Express.Multer.File, userId: string) {
    // In a real S3 implementation, we would upload to S3 first
    // For now, we'll pass the file buffer or a temporary path
    const material = await this.prisma.material.create({
      data: {
        filename: file.originalname,
        filePath: `uploads/${file.originalname}`, // Placeholder
        mimeType: file.mimetype,
        topicId,
      },
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
