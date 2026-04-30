import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, start_time, end_time, id_event, id_room, speaker_ids } = body

    if (!title || !description || !start_time || !end_time || !id_event || !id_room) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants : title, description, start_time, end_time, id_event, id_room' },
        { status: 400 }
      )
    }

    const session = await prisma.session.create({
      data: {
        title,
        description,
        start_time: new Date(start_time),   
        end_time:   new Date(end_time),
        id_event,
        id_room,
        speakers: {
          create: (speaker_ids ?? []).map((id: string) => ({ id }))
        }
      },
      include: {
        speakers: { include: { speaker: true } },
        room:     true,
        event:    true
      }
    })

    return NextResponse.json(session, { status: 201 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur serveur interne' }, { status: 500 })
  }
}