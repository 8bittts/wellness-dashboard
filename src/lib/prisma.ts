import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaClientSingleton = () => {
  console.log('Initializing PrismaClient...');
  try {
    return new PrismaClient({
      log: ['query', 'error', 'warn'],
      errorFormat: 'pretty',
    });
  } catch (error) {
    console.error('Failed to initialize PrismaClient:', error);
    throw error;
  }
};

if (!globalForPrisma.prisma) {
  try {
    globalForPrisma.prisma = prismaClientSingleton();
  } catch (error) {
    console.error('Failed to set global prisma instance:', error);
    throw error;
  }
}

export const prisma = globalForPrisma.prisma;

if (process.env.NODE_ENV !== 'production') {
  console.log('Development environment detected, setting global prisma instance');
  globalForPrisma.prisma = prisma;
} 