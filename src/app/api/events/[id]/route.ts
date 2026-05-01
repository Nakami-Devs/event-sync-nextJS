import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";

type Params = { params: { id: string}}

export async function GET(_req: NextRequest, { params }: Params){
    try{
        const event = await prisma.event.findUnique({
            where: {id: params.id},
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
                { message: 'Event not found'},
                { status: 404 }
            )
        }

        return NextResponse.json(event, {status: 200})
    } catch (error){
        console.error('Error retrieving the event', error);
        return NextResponse.json(
            { message : 'Internal server error '},
            { status: 500 }
        )
    }
}

export async function PUT(req: NextRequest, { params }: Params){
    try{
        const { title, description, start_date, end_date, place } = await req.json()

        const existing = await prisma.event.findUnique({
            where: { id: params.id }
        })

        if(!existing){
            return NextResponse.json(
                { message: 'Event not found'},
                { status: 404 }
            )
        }

        const updated = await prisma.event.update({
            where: { id: params.id },
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
        console.error('Error updating event', error)
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        )
    }
}