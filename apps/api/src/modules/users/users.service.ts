import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../repositories/user.repository';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UserRepository) {}

  async findById(id: string) {
    const user = await this.repository.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.repository.findUnique({ where: { email } });
  }

  async update(id: string, data: UpdateUserDto) {
    return this.repository.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.repository.delete({ where: { id } });
  }
}
