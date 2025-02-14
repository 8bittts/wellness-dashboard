import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteSegmentConfig {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function DELETE(
  _req: NextRequest,
  { params }: RouteSegmentConfig
) {
  try {
    const id = parseInt(params.id);
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