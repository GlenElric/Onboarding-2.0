import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from '../../repositories/user.repository';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UserRepository;

  const mockUserRepository = {
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      const result = { id: '1', email: 'test@test.com' };
      mockUserRepository.findUnique.mockResolvedValue(result);

      expect(await service.findById('1')).toEqual(result);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findUnique.mockResolvedValue(null);

      await expect(service.findById('1')).rejects.toThrow(NotFoundException);
    });
  });
});
