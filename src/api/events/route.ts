import { NextResponse } from 'next/server';
import createPrismaClient from '@/lib/prisma/client';

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
    console.error('Error retrieving events:', error);
    return NextResponse.json(
      { error: 'Error retrieving events' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const prisma = createPrismaClient();
    const body = await request.json();
    const { title, description, startDate, endDate, location } = body;

    if (!title || !description || !startDate || !endDate || !location) {
      return NextResponse.json(
        { error: 'All fields are required' },
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
    console.error('Error creating the event', error);
    return NextResponse.json(
      { error: 'Error creating the event' },
      { status: 500 }
    );
  }
}
