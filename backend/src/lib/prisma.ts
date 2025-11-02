import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// Verify User model exists
if (!prisma.user) {
  console.error('⚠️  Prisma Client Error: User model not found. Please run: npx prisma generate');
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

