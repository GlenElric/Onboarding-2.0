import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseRepository } from './base.repository';
import { User } from '@prisma/client';
import { UpdateUserDto } from '../modules/users/dto/user.dto';

@Injectable()
export class UserRepository extends BaseRepository<User, any, UpdateUserDto> {
  constructor(prisma: PrismaService) {
    super(prisma, 'user');
  }
}
