import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseRepository } from './base.repository';
import { User } from '@prisma/client';
import { SignupDto } from '../modules/auth/dto/auth.dto';

@Injectable()
export class UserRepository extends BaseRepository<User, SignupDto, Partial<SignupDto>> {
  constructor(prisma: PrismaService) {
    super(prisma, 'user');
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
