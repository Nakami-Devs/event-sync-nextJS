import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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