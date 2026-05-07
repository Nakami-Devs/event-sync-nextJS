import { NextResponse } from 'next/server';
import createPrismaClient from '@/lib/prisma/client';

// GET /api/events - Liste tous les événements
export async function GET() {
  try {
    const prisma = createPrismaClient();
    const events = await prisma.event.findMany({
      include: {
        sessions: {
          include: {
            room: true,
            speakers: true,
            _count: {
              select: { questions: true }
            }
          },
          orderBy: { startTime: 'asc' }
        }
      },
      orderBy: { startDate: 'asc' }
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des événements' },
      { status: 500 }
    );
  }
}

// POST /api/events - Créer un nouvel événement
export async function POST(request: Request) {
  try {
    const prisma = createPrismaClient();
    const body = await request.json();
    const { title, description, startDate, endDate, location } = body;

    if (!title || !description || !startDate || !endDate || !location) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location
      }
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de l\'événement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'événement' },
      { status: 500 }
    );
  }
}