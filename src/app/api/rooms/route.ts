import {NextResponse} from "next/server";
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