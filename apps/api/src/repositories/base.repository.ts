import { PrismaService } from '../prisma/prisma.service';

export abstract class BaseRepository<T, CreateDto, UpdateDto> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelName: string,
  ) {}

  get model() {
    return this.prisma[this.modelName as keyof PrismaService] as any;
  }

  async findMany(args?: any): Promise<T[]> {
    return this.model.findMany(args);
  }

  async findUnique(args: any): Promise<T | null> {
    return this.model.findUnique(args);
  }

  async findFirst(args: any): Promise<T | null> {
    return this.model.findFirst(args);
  }

  async create(args: { data: CreateDto; include?: any }): Promise<T> {
    return this.model.create(args);
  }

  async update(args: { where: any; data: UpdateDto; include?: any }): Promise<T> {
    return this.model.update(args);
  }

  async delete(args: { where: any }): Promise<T> {
    return this.model.delete(args);
  }

  async upsert(args: { where: any; create: CreateDto; update: UpdateDto }): Promise<T> {
    return this.model.upsert(args);
  }

  async count(args?: any): Promise<number> {
    return this.model.count(args);
  }
}
