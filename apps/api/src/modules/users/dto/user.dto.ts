import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';
import { PlatformRole } from '@prisma/client';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(PlatformRole)
  @IsOptional()
  role?: PlatformRole;
}
