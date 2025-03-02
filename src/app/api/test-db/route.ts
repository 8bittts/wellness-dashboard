import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const diagnostics = {
    env: {
      DATABASE_URL: process.env.DATABASE_URL ? `...${process.env.DATABASE_URL.substring(process.env.DATABASE_URL.indexOf('@'))}` : 'not set',
      DIRECT_URL: process.env.DIRECT_URL ? `...${process.env.DIRECT_URL.substring(process.env.DIRECT_URL.indexOf('@'))}` : 'not set',
      NODE_ENV: process.env.NODE_ENV || 'not set'
    },
    prismaStatus: 'not tested',
    neonStatus: 'not tested',
    errors: [] as string[]
  };

  try {
    // Test Prisma connection
    diagnostics.prismaStatus = 'testing';
    const participantCount = await prisma.participantData.count();
    diagnostics.prismaStatus = 'success';
    
    // Test direct Neon connection
    try {
      diagnostics.neonStatus = 'testing';
      const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL || '';
      if (!connectionString) {
        throw new Error('No database connection string available');
      }
      
      const pool = new Pool({ connectionString });
      const { rows } = await pool.query('SELECT NOW() as time');
      await pool.end();
      
      diagnostics.neonStatus = 'success';
      
      return NextResponse.json({
        status: 'success',
        message: 'Database connection successful',
        time: rows[0]?.time,
        participantCount,
        database: connectionString.split('@')[1]?.split('/')[0] || 'unknown',
        diagnostics
      });
    } catch (neonError) {
      diagnostics.neonStatus = 'failed';
      diagnostics.errors.push(`Neon error: ${neonError instanceof Error ? neonError.message : String(neonError)}`);
      
      return NextResponse.json({
        status: 'partial',
        message: 'Prisma connection successful but direct Neon connection failed',
        participantCount,
        diagnostics,
        error: neonError instanceof Error ? neonError.message : String(neonError)
      }, { status: 207 });
    }
  } catch (error) {
    diagnostics.prismaStatus = 'failed';
    diagnostics.errors.push(`Prisma error: ${error instanceof Error ? error.message : String(error)}`);
    
    console.error('Error connecting to database:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : String(error),
      diagnostics
    }, { status: 500 });
  }
} 