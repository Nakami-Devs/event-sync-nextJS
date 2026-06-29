import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(){
    try {
        const rooms = await prisma.room.findMany({
            orderBy: { name: 'asc' }
        })
        const total = rooms.length;

        return NextResponse.json(rooms, {
            status: 200,
            headers: {
                'X-Total-Count': total.toString(),
            }
        })
    } catch (error) {
        console.error('Erreur lors de la récupération des salles', error)
        return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 })
    }
}

export async function POST(req: NextRequest){
    try {
        const { name, capacity } = await req.json()

        if (!name || !capacity) {
            return NextResponse.json(
                { message: 'Les champs name et capacity sont requis' },
                { status: 400 }
            )
        }

        const existingRoom = await prisma.room.findFirst({
            where: {
                name,
                capacity,
            }
        });

        if(existingRoom){
            return NextResponse.json(
                { message: `Une salle ${name} existe déjà`},
                { status: 409 }
            )
        }

        const room = await prisma.room.create({
            data: { name, capacity }
        })

        return NextResponse.json(room, { status: 201 })
    } catch (error) {
        console.error('Erreur lors de la création de la salle', error)
        return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 })
    }
}