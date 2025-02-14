import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    return NextResponse.json(
      { error: 'Error deleting participant', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 