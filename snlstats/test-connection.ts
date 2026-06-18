import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  try {
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log('✓ Connected successfully!', result);
  } catch (error) {
    console.error('✗ Connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

test();