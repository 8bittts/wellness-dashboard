import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaClientSingleton = () => {
  console.log('Initializing PrismaClient...');
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
  });
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  console.log('Development environment detected, setting global prisma instance');
  globalForPrisma.prisma = prisma;
} 