import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
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
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsEnum(OrgRole)
  role: OrgRole;
}
