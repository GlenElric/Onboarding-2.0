import { IsString, IsNotEmpty } from 'class-validator';

export class ChatMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  topicId: string;
}
