import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteParams = {
  params: {
    id: string;
  };
};

export async function DELETE(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const id = parseInt(context.params.id);
    await prisma.participantData.delete({
      where: {
        id,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting participant:', error);
    return NextResponse.json(
      { error: 'Error deleting participant' },
      { status: 500 }
    );
  }
} 