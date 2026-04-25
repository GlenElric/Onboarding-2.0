import { PrismaClient, OrgRole } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // 1. Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: 'password123',
      name: 'Global Admin',
      role: 'PLATFORM_ADMIN',
    },
  });

  // 2. Create Learner User
  const learner = await prisma.user.upsert({
    where: { email: 'learner@example.com' },
    update: {},
    create: {
      email: 'learner@example.com',
      password: 'password123',
      name: 'John Learner',
      role: 'USER',
    },
  });

  // 3. Create Organization
  const org = await prisma.organization.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: {
      name: 'Acme Corp',
      slug: 'acme-corp',
    },
  });

  // 4. Add memberships
  await prisma.organizationMembership.upsert({
    where: { organizationId_userId: { organizationId: org.id, userId: admin.id } },
    update: {},
    create: { organizationId: org.id, userId: admin.id, role: OrgRole.ORG_ADMIN },
  });

  await prisma.organizationMembership.upsert({
    where: { organizationId_userId: { organizationId: org.id, userId: learner.id } },
    update: {},
    create: { organizationId: org.id, userId: learner.id, role: OrgRole.LEARNER },
  });

  // 5. Create a Private Course
  const course = await prisma.course.create({
    data: {
      title: 'Internal Security Policy',
      description: 'Confidential security training for Acme Corp employees.',
      difficulty: 'Intermediate',
      visibility: 'Private',
      organizationId: org.id,
    },
  });

  console.log('Seed completed successfully.');
  console.log(`Admin: admin@example.com / password123`);
  console.log(`Org ID: ${org.id}`);
  console.log(`Course ID: ${course.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
