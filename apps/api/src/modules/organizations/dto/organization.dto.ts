import { IsString, IsNotEmpty, IsEmail, IsEnum } from 'class-validator';
import { OrgRole } from '@prisma/client';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;
}

export class AddMemberDto {
  @IsEmail()
  email: string;

  @IsEnum(OrgRole)
  role: OrgRole;
}
