import { NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test Prisma connection
    const participantCount = await prisma.participantData.count();
    
    // Test direct Neon connection
    const connectionString = process.env.DATABASE_URL || '';
    const pool = new Pool({ connectionString });
    
    const { rows } = await pool.query('SELECT NOW() as time');
    await pool.end();
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      time: rows[0]?.time,
      participantCount,
      database: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'unknown'
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 