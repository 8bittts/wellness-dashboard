import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

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

    // Handle specific Prisma errors
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        { error: 'Database connection error. Please try again later.' },
        { status: 503 }
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: 'Database query error. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
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

    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        { error: 'Database connection error. Please try again later.' },
        { status: 503 }
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'A participant with this ID already exists.' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Error creating participant' },
      { status: 500 }
    );
  }
} 