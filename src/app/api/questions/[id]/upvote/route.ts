import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  
) {
  try {
    const { id } = await params  

    const existing = await prisma.question.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Question introuvable' }, { status: 404 })
    }

    const updated = await prisma.question.update({
      where: { id },
      data:  { upvote_numbers: { increment: 1 } }
    })

    return NextResponse.json(updated, { status: 200 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur serveur interne' }, { status: 500 })
  }
}