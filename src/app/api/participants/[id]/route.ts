import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json(
      { error: 'Missing participant ID' },
      { status: 400 }
    );
  }

  try {
    const id = parseInt(params.id);
    const deletedParticipant = await prisma.participantData.delete({
      where: {
        id,
      },
    });
    return NextResponse.json({ success: true, data: deletedParticipant });
  } catch (error) {
    console.error('Error deleting participant:', error);
    return NextResponse.json(
      { error: 'Error deleting participant' },
      { status: 500 }
    );
  }
} 