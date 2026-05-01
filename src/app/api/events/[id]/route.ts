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