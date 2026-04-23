import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class ChatRequestDto {
  @IsUUID()
  topicId: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
