import { PrismaClient } from '@prisma/client';
import { Pool } from '@neondatabase/serverless';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaClientSingleton = () => {
  // For better serverless performance with Neon
  if (process.env.NODE_ENV === 'production') {
    // This is only needed in production
    const connectionString = process.env.DATABASE_URL;
    if (connectionString) {
      // Create a new connection pool with the Neon serverless driver
      const pool = new Pool({ connectionString });
      
      // Handle pool errors
      pool.on('error', (err) => {
        console.error('Neon pool error:', err);
      });
    }
  }
  
  return new PrismaClient({
    log: ['error', 'warn'],
  });
};

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prismaClientSingleton();
}

export const prisma = globalForPrisma.prisma; 