import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  order: number;
}
