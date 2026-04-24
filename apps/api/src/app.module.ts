import { Module } from '@nestjs/common';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CoursesModule } from './modules/courses/courses.module';
import { EnrollmentsModule } from './modules/learning/enrollments.module';
import { QuizModule } from './modules/assessments/quiz.module';
import { ContentModule } from './modules/content/content.module';
import { AiModule } from './modules/ai/ai.module';
import { CommerceModule } from './modules/commerce/commerce.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    EnrollmentsModule,
    QuizModule,
    ContentModule,
    AiModule,
    CommerceModule,
    OrganizationsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
