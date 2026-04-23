import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('/auth/signup (POST)', async () => {
    const email = `test${Date.now()}@example.com`;
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email,
        password: 'password123',
        name: 'Test User',
      })
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('access_token');
        expect(response.body.user.email).toBe(email);
      });
  });

  it('/courses (GET)', () => {
    return request(app.getHttpServer())
      .get('/courses')
      .expect(200);
  });
});
