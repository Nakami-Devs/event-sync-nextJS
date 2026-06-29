import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  
) {
  try {
    const { id } = await params  

    const session = await prisma.session.findUnique({ where: { id } })
    if (!session) {
      return NextResponse.json({ error: 'Session introuvable' }, { status: 404 })
    }

    const questions = await prisma.question.findMany({
      where:   { id_session: id },
      orderBy: { upvote_numbers: 'desc' }
    })

    return NextResponse.json(questions, { status: 200 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur serveur interne' }, { status: 500 })
  }
}