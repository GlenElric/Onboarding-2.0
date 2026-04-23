import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  difficulty?: string;

  @IsNumber()
  @IsOptional()
  price?: number;
}

export class UpdateCourseDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  difficulty?: string;

  @IsNumber()
  @IsOptional()
  price?: number;
}
