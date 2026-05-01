import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";

type Params = { params: { roomId: string } }

export async function GET(_req: NextRequest, { params }: Params) {
    try {
        const room = await prisma.room.findUnique({
            where: { id: params.roomId },
            include: { sessions: true }
        })

        if (!room) {
            return NextResponse.json(
                { message: 'Room not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(room, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        )
    }
}