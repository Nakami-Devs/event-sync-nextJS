import { NextResponse } from 'next/server';
import createPrismaClient from '@/lib/prisma/client';

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        sessions: {
          include: {
            event: true,
            speakers: true
          }
        }
      }
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Erreur lors de la récupération des salles:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des salles' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, capacity } = body;

    if (!name || !capacity) {
      return NextResponse.json(
        { error: 'Le nom et la capacité sont requis' },
        { status: 400 }
      );
    }

    const room = await prisma.room.create({
      data: {
        name,
        capacity
      }
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la salle:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la salle' },
      { status: 500 }
    );
  }
}