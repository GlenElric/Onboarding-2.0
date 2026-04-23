import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateTopicDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  order: number;
}

export class CreateChunkDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsInt()
  order: number;
}
