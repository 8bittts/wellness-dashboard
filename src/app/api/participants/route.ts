import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const participants = await prisma.participantData.findMany({
      orderBy: {
        date: 'asc',
      },
    });
    return NextResponse.json(participants);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Can't reach database server")
    ) {
      return NextResponse.json(
        { error: 'Database connection error. Please try again later.' },
        { status: 503 }
      );
    }

    console.error('Error fetching participants:', error);
    return NextResponse.json(
      { 
        error: 'Error fetching participants',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const participant = await prisma.participantData.create({
      data: {
        ...data,
        date: new Date().toLocaleDateString(),
      },
    });
    return NextResponse.json(participant);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Can't reach database server")
    ) {
      return NextResponse.json(
        { error: 'Database connection error. Please try again later.' },
        { status: 503 }
      );
    }

    console.error('Error creating participant:', error);
    return NextResponse.json(
      { 
        error: 'Error creating participant',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 