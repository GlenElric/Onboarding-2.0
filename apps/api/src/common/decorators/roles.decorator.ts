import { SetMetadata } from '@nestjs/common';
import { PlatformRole } from '@prisma/client';

export const Roles = (...roles: PlatformRole[]) => SetMetadata('roles', roles);
