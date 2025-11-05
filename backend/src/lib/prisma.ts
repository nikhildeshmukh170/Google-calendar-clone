import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

function initializePrismaClient() {
  // Debug: print DATABASE_URL and whether sqlite file exists
  try {
    console.log('🔍 Prisma Initialization - Process Info:');
    console.log('  • Working Directory:', process.cwd());
    console.log('  • NODE_ENV:', process.env.NODE_ENV);
    console.log('  • DATABASE_URL:', process.env.DATABASE_URL);

    if (process.env.DATABASE_URL?.startsWith('file:')) {
      const filePath = process.env.DATABASE_URL.replace(/^file:\/\//, '').replace(/^file:/, '');
      const resolved = path.resolve(filePath);
      console.log('  • Resolved SQLite path:', resolved);
      const exists = fs.existsSync(resolved);
      console.log('  • SQLite file exists:', exists);
      
      if (exists) {
        const stats = fs.statSync(resolved);
        console.log('  • SQLite file size:', stats.size, 'bytes');
        console.log('  • File permissions:', stats.mode.toString(8));
      }
    }

    // Try to create prisma directory if it doesn't exist
    const prismaDir = path.join(process.cwd(), 'prisma');
    if (!fs.existsSync(prismaDir)) {
      console.log('  • Creating prisma directory');
      fs.mkdirSync(prismaDir, { recursive: true });
    }

    // Initialize PrismaClient with debug logs
    const prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });

    // Test database connection
    console.log('🔌 Testing database connection...');
    return prisma;
  } catch (e) {
    console.error('❌ Prisma initialization error:', e);
    throw e;
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? initializePrismaClient();

// Add debug route to server.ts
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}

