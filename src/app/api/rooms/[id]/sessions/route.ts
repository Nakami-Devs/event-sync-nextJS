import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  
) {
  try {
    const { id } = await params  
    const room = await prisma.room.findUnique({ where: { id } })
    if (!room) {
      return NextResponse.json({ error: 'Salle introuvable' }, { status: 404 })
    }

    const sessions = await prisma.session.findMany({
      where:   { id_room: id },
      orderBy: { start_time: 'asc' },
      include: {
        speakers: { include: { speaker: true } },
        event:    true
      }
    })

    const now = new Date()
    const sessionsWithLive = sessions.map((session: any) => ({
      ...session,
      is_live: now >= session.start_time && now <= session.end_time
    }))

    return NextResponse.json(sessionsWithLive, { status: 200 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur serveur interne' }, { status: 500 })
  }
}