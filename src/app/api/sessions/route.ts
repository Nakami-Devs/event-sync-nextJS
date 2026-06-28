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
        end_time: new Date(end_time),
        id_event,
        id_room,
        speakers: {
          create: (speaker_ids ?? []).map((speakerId: string) => ({ id_speaker: speakerId }))
        }
      },
      include: {
        speakers: { include: { speaker: true } },
        room: true,
        event: true
      }
    })

    return NextResponse.json(session, { status: 201 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur serveur interne' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const id_event = request.nextUrl.searchParams.get('id_event')

    if (!id_event) {
      return NextResponse.json(
        { error: 'id_event query parameter is required' },
        { status: 400 }
      )
    }

    const sessions = await prisma.session.findMany({
      where: { id_event: id_event },
      include: { room: true, speakers: { include: { speaker: true } } },
      orderBy: {
        start_time: 'asc'
      }
    })

    const transformedSessions = sessions.map((session: any) => ({
      id: session.id,
      title: session.title,
      description: session.description,
      start_time: session.start_time,
      end_time: session.end_time,
      id_event: session.id_event,
      id_room: session.id_room,
      room_name: session.room.name,
      speakers: session.speakers.map((s: any) => ({
        id: s.id_speaker,
        full_name: s.speaker.full_name,
      })),
      speaker_ids: session.speakers.map((s: any) => s.id_speaker)
    }))

    const response = NextResponse.json(transformedSessions)
    response.headers.set('X-Total-Count', transformedSessions.length.toString())
    return response

  } catch (error) {
    console.error('Erreur GET /api/sessions:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}