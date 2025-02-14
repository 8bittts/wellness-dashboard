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
    console.error('Error fetching participants:', error);
    return NextResponse.json(
      { error: 'Error fetching participants' },
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
    console.error('Error creating participant:', error);
    return NextResponse.json(
      { error: 'Error creating participant' },
      { status: 500 }
    );
  }
} 