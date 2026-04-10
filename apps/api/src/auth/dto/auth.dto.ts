import { IsString, IsEmail, MinLength, IsOptional, IsEnum } from 'class-validator';
import { GlobalUserRole } from '@prisma/client';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEnum(GlobalUserRole)
  @IsOptional()
  role?: GlobalUserRole;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
