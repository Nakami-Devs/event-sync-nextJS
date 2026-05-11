import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const speaker = await prisma.speaker.findUnique({
      where: { id: (await params).id },
      include: {
        sessions: {
          include: {
            session: {
              include: {
                event: true,
                room: true,
              }
            },
          },
        },
      },
    })
    
    if (!speaker) {
      return NextResponse.json(
        { message: 'Intervenant non trouvé' },
        { status: 404 }
      )
    }
    return NextResponse.json(speaker, { status : 200 })
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'intervenant', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
