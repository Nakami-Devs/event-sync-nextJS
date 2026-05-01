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

export async function PUT(req: NextRequest, { params }: Params) {
    try {
        const { name, capacity } = await req.json()

        const existing = await prisma.room.findUnique({
            where: { id: params.roomId }
        })

        if (!existing) {
            return NextResponse.json(
                { message: 'Room not found' },
                { status: 404 }
            )
        }

        const updated = await prisma.room.update({
            where: { id: params.roomId },
            data: {
                ...(name && { name }),
                ...(capacity && { capacity }),
            }
        })

        return NextResponse.json(updated, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        )
    }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    try {
        const existing = await prisma.room.findUnique({
            where: { id: params.roomId }
        })

        if (!existing) {
            return NextResponse.json(
                { message: 'Room not found' },
                { status: 404 }
            )
        }

        await prisma.room.delete({ where: { id: params.roomId } })

        return NextResponse.json(
            { message: 'Room deleted successfully' },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        )
    }
}