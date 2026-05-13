import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";

type Params = {
  params: Promise<{ id: string }>
}
export async function GET(_req: NextRequest, { params }: Params) {
      const { id } = await params
    try {
        const room = await prisma.room.findUnique({
              where: { id },
            include: { sessions: true }
        })

        if (!room) {
            return NextResponse.json(
                { message: 'Salle introuvable' },
                { status: 404 }
            )
        }

        return NextResponse.json(room, { status: 200 })
    } catch (error) {
          console.error('Erreur lors de la récupération de la salle', error)
        return NextResponse.json(
            { message: 'Erreur interne du serveur' },
            { status: 500 }
        )
    }
}

export async function PUT(req: NextRequest, { params }: Params) {
    const   { id } = await params
    try {
        const { name, capacity } = await req.json()

        const existing = await prisma.room.findUnique({
            where: { id}
        })

        if (!existing) {
            return NextResponse.json(
                { message: 'Salle introuvable' },
                { status: 404 }
            )
        }

        const updated = await prisma.room.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(capacity && { capacity }),
            }
        })

        return NextResponse.json(updated, { status: 200 })
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la salle', error)
        return NextResponse.json(
            { message: 'Erreur interne du serveur' },
            { status: 500 }
        )
    }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    const { id } = await params
    try {
        const existing = await prisma.room.findUnique({
            where: { id}
        })

        if (!existing) {
            return NextResponse.json(
                { message: 'Salle introuvable' },
                { status: 404 }
            )
        }

        await prisma.room.delete({ where: { id } })

        return NextResponse.json(
            { message: 'Salle supprimée avec succès' },
            { status: 200 }
        )
    } catch (error) {
        console.error('Erreur lors de la suppression de la salle', error)
        return NextResponse.json(
            { message: 'Erreur interne du serveur' },
            { status: 500 }
        )
    }
}