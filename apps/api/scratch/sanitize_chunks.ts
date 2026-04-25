
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function sanitizeChunks() {
  const chunks = await prisma.topicContentChunk.findMany();
  console.log(`Found ${chunks.length} chunks to sanitize.`);

  let updatedCount = 0;
  for (const chunk of chunks) {
    const original = chunk.content;
    // Remove control characters except \n and \t
    const sanitized = original.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\xff]/g, '');
    
    if (sanitized !== original) {
      await prisma.topicContentChunk.update({
        where: { id: chunk.id },
        data: { content: sanitized }
      });
      updatedCount++;
    }
  }

  console.log(`Sanitization complete. ${updatedCount} chunks updated.`);
}

sanitizeChunks()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
