import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        speakers: { include: { speaker: true } },
        room:     true,
        event:    true,
        questions: {
          orderBy: { upvote_numbers: 'desc' }
        }
      }
    })

    if (!session) {
      return NextResponse.json({ error: 'Session introuvable' }, { status: 404 })
    }

    const now    = new Date()
    const isLive = now >= session.start_time && now <= session.end_time

    const transformedSession = {
      id: session.id,
      title: session.title,
      description: session.description,
      start_time: session.start_time,
      end_time: session.end_time,
      id_event: session.id_event,
      id_room: session.id_room,
      room_name: session.room?.name ?? null,
      capacity: session.room?.capacity ?? null,
      speakers: session.speakers.map(s => ({
        id: s.id_speaker,
        full_name: s.speaker.full_name,
      })),
      speaker_ids: session.speakers.map(s => s.id_speaker),
      is_live: isLive,
      questions: session.questions,
    }

    return NextResponse.json(transformedSession, { status: 200 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur serveur interne' }, { status: 500 })
  }
}



export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  
) {
  try {
    const { id } = await params  
    const body = await request.json()
    const { title, description, start_time, end_time, id_event, id_room } = body

    const existing = await prisma.session.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Session introuvable' }, { status: 404 })
    }

    const updated = await prisma.session.update({
      where: { id },
      data: {
        ...(title       && { title }),
        ...(description && { description }),
        ...(start_time  && { start_time: new Date(start_time) }),
        ...(end_time    && { end_time:   new Date(end_time) }),
        ...(id_event    && { id_event }),
        ...(id_room     && { id_room }),
      },
      include: {
        speakers: { include: { speaker: true } },
        room:     true,
        event:    true
      }
    })

    return NextResponse.json(updated, { status: 200 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur serveur interne' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  
) {
  try {
    const { id } = await params  

    const existing = await prisma.session.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Session introuvable' }, { status: 404 })
    }

    await prisma.sessionSpeaker.deleteMany({ where: { id_session: id } })
    await prisma.question.deleteMany({       where: { id_session: id } })
    await prisma.session.delete({            where: { id } })

    return NextResponse.json({ message: 'Session supprimée avec succès' }, { status: 200 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur serveur interne' }, { status: 500 })
  }
}