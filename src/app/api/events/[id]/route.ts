import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";

type Params = Promise<{ id: string }>

export async function GET(_req: NextRequest, { params }: {params: Params}){
    const {id} = await params;

    try{
        const event = await prisma.event.findUnique({
            where: {id},
            include: {
                sessions: {
                    include: {
                        room: true,
                        speakers: {
                            include: { speaker: true}
                        }
                    }
                }
            }
        })

        if(!event){
            return NextResponse.json(
                { message: 'Événement non trouvé'},
                { status: 404 }
            )
        }

        return NextResponse.json(event, {status: 200})
    } catch (error){
        console.error('Erreur lors de la récupération de l\'événement', error);
        return NextResponse.json(
            { message : 'Erreur interne du serveur'},
            { status: 500 }
        )
    }
}

export async function PUT(req: NextRequest, { params }: {params: Params}){
    const {id} = await params;

    try{
        const { title, description, start_date, end_date, place } = await req.json()

        const existing = await prisma.event.findUnique({
            where: { id }
        })

        if(!existing){
            return NextResponse.json(
                { message: 'Événement non trouvé'},
                { status: 404 }
            )
        }

        const updated = await prisma.event.update({
            where: { id },
            data: {
                ...(title && {title}),
                ...(description && {description}),
                ...(start_date && {start_date: new Date(start_date)}),
                ...(end_date && {end_date: new Date(end_date)}),
                ...(place && {place}),
            },
        })
        return NextResponse.json(updated, { status: 200 })
    } catch (error){
        console.error('Erreur lors de la mise à jour de l\'événement', error)
        return NextResponse.json(
            { message: 'Erreur interne du serveur' },
            { status: 500 }
        )
    }
}

export async function DELETE(_req: NextRequest, { params }: {params: Params}){
    const {id} = await params;

    try{
        const existing = await prisma.event.findUnique({
            where: { id }
        })

        if(!existing){
            return NextResponse.json(
                { message: 'Événement non trouvé'},
                { status: 404 }
            )
        }

        await prisma.event.delete({
            where: { id }
        })


        return NextResponse.json(
            { message: 'Événement supprimé avec succès' },
            { status: 200 }
        )
    } catch(error){
        console.error('Erreur lors de la suppression de l\'événement', error)
        return NextResponse.json(
            { message: 'Erreur interne du serveur' },
            { status: 500 }
        )
    }
}