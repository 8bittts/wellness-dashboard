import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// @ts-ignore - The Next.js App Router types for API routes
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  if (!id) {
    return NextResponse.json(
      { error: 'Missing participant ID' },
      { status: 400 }
    );
  }

  try {
    const participantId = parseInt(id);
    
    // First check if the participant exists
    const participant = await prisma.participantData.findUnique({
      where: { id: participantId }
    });

    if (!participant) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      );
    }

    const deletedParticipant = await prisma.participantData.delete({
      where: { id: participantId }
    });
    
    return NextResponse.json({ 
      success: true, 
      data: deletedParticipant 
    });
  } catch (error) {
    console.error('Error deleting participant:', error);

    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        { error: 'Database connection error. Please try again later.' },
        { status: 503 }
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Participant not found' },
          { status: 404 }
        );
      }
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