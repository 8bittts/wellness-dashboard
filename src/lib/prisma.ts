import { PrismaClient } from '@prisma/client';
import { Pool } from '@neondatabase/serverless';

// For logging database connection details
const logConnectionInfo = () => {
  console.log('DATABASE_URL type:', typeof process.env.DATABASE_URL);
  console.log('DATABASE_URL length:', process.env.DATABASE_URL?.length);
  console.log('DIRECT_URL type:', typeof process.env.DIRECT_URL);
  console.log('DIRECT_URL length:', process.env.DIRECT_URL?.length);
  console.log('NODE_ENV:', process.env.NODE_ENV);
}

// Log connection info at startup
logConnectionInfo();

// For better performance with Neon in serverless environments
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  // In production, initialize the client only once
  prisma = new PrismaClient({
    log: ['error'],
    datasources: {
      db: {
        url: process.env.DIRECT_URL,
      },
    },
  });
} else {
  // In development, create a new client or use cached client
  const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
  };

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: ['error', 'warn'],
    });
  }

  prisma = globalForPrisma.prisma;
}

export { prisma }; 