import {
  Controller,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContentService } from './content.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { PlatformRole } from '@prisma/client';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Roles(PlatformRole.PLATFORM_ADMIN)
  @Post('upload-pdf/:topicId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPdf(
    @Param('topicId') topicId: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    return this.contentService.processPdf(topicId, file, req.user.id);
  }
}
