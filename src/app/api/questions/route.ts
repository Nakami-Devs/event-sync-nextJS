import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, name, id_session } = body

    if (!content || !id_session) {
      return NextResponse.json(
        { error: 'content et id_session sont obligatoires' },
        { status: 400 }
      )
    }

    const session = await prisma.session.findUnique({ where: { id: id_session } })
    if (!session) {
      return NextResponse.json({ error: 'Session introuvable' }, { status: 404 })
    }

    const now    = new Date()
    const isLive = now >= session.start_time && now <= session.end_time
    if (!isLive) {
      return NextResponse.json(
        { error: 'Les questions ne peuvent être posées que pendant une session en cours (live)' },
        { status: 403 }
      )
    }

    const question = await prisma.question.create({
      data: {
        content,
        name:       name ?? 'ANONYM',  
        id_session
      }
    })

    return NextResponse.json(question, { status: 201 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur serveur interne' }, { status: 500 })
  }
}