import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Debug: print DATABASE_URL and whether sqlite file exists (helps on Render)
try {
  console.log('Prisma debug - DATABASE_URL:', process.env.DATABASE_URL);
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('file:')) {
    const filePath = process.env.DATABASE_URL.replace(/^file:\/\//, '').replace(/^file:/, '');
    const resolved = path.resolve(filePath);
    console.log('Prisma debug - resolved sqlite file path:', resolved);
    console.log('Prisma debug - sqlite file exists:', fs.existsSync(resolved));
  }
} catch (e) {
  console.error('Prisma debug - failed to check sqlite file:', e);
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// Verify User model exists
if (!prisma.user) {
  console.error('⚠️  Prisma Client Error: User model not found. Please run: npx prisma generate');
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

