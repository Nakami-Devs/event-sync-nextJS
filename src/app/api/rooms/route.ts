import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(){
    try {
        const rooms = await prisma.room.findMany({
            orderBy: { name: 'asc' }
        })
        return NextResponse.json(rooms, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}

export async function POST(req: NextRequest){
    try {
        const { name, capacity } = await req.json()

        if (!name || !capacity) {
            return NextResponse.json(
                { message: 'Name and capacity required' },
                { status: 400 }
            )
        }

        const room = await prisma.room.create({
            data: { name, capacity }
        })

        return NextResponse.json(room, { status: 201 })
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}