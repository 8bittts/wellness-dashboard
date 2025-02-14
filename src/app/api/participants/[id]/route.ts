import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma, PrismaClient } from '@prisma/client';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('DELETE request received for ID:', params.id);
  
  if (!params.id) {
    console.log('No ID provided');
    return NextResponse.json(
      { error: 'Missing participant ID' },
      { status: 400 }
    );
  }

  try {
    console.log('Attempting to delete participant with ID:', params.id);
    const id = parseInt(params.id);
    
    // First check if the participant exists
    const participant = await prisma.participantData.findUnique({
      where: { id }
    });

    if (!participant) {
      console.log('Participant not found:', id);
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      );
    }

    const deletedParticipant = await prisma.participantData.delete({
      where: { id }
    });
    
    console.log('Successfully deleted participant:', deletedParticipant);
    return NextResponse.json({ 
      success: true, 
      data: deletedParticipant 
    });
  } catch (error) {
    console.error('Detailed error:', error);

    // Handle known Prisma errors
    if (
      error instanceof Error &&
      error.name === 'PrismaClientKnownRequestError' &&
      'code' in error
    ) {
      const prismaError = error as { code: string };
      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { error: 'Unique constraint violation' },
          { status: 409 }
        );
      }
      if (prismaError.code === 'P2025') {
        return NextResponse.json(
          { error: 'Record not found' },
          { status: 404 }
        );
      }
    }

    // Handle initialization errors
    if (
      error instanceof Error &&
      error.name === 'PrismaClientInitializationError'
    ) {
      return NextResponse.json(
        { error: 'Database connection error', details: error.message },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Error deleting participant', 
        details: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.constructor.name : 'Unknown'
      },
      { status: 500 }
    );
  }
} 