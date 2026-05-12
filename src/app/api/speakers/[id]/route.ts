import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }
export async function GET(_req: NextRequest, { params }: Params ) {
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

export async function PUT(req: NextRequest, {params}: Params) {
  try{
    const { full_name, profile_pic, biography, external_links } = await req.json()

    const existing = await prisma.speaker.findUnique({
      where: {id: (await params).id},
    })

    if(!existing){
      return NextResponse.json(
          { message: 'Intervenant non trouvé' },
          { status: 404 }
      )
    }

    if (full_name && full_name !== existing.full_name) {
      const duplicateName = await prisma.speaker.findFirst({
        where: {
          full_name,
          NOT: { id: (await params).id },
        },
      })

      if (duplicateName) {
        return NextResponse.json(
            { message: `Un intervenant avec le nom "${full_name}" existe déjà` },
            { status: 409 }
        )
      }
    }

    const updated = await prisma.speaker.update({
      where: { id: (await params).id },
      data: {
        ...(full_name && { full_name }),
        ...(profile_pic && { profile_pic }),
        ...(biography && { biography }),
        ...(external_links && { external_links }),
      },
    })

    return NextResponse.json(updated, {status: 200})
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'intervenant', error)
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const existing = await prisma.speaker.findUnique({
      where: { id: (await params).id },
    })

    if (!existing) {
      return NextResponse.json(
          { message: 'Intervenant non trouvé' },
          { status: 404 }
      )
    }

    await prisma.speaker.delete({
      where: { id: (await params).id },
    })

    return NextResponse.json(
        { message: 'Intervenant supprimé' },
        { status: 200 }
    )
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'intervenant', error)
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 })
  }
}
