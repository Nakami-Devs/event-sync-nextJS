import {NextRequest, NextResponse} from 'next/server';
import {createPrismaClient, prisma} from "@/lib/prisma";

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
          orderBy: { start_time: 'asc' }
        }
      },
      orderBy: { start_date: 'asc' }
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

export async function POST(request: NextRequest) {
  try {
    const prisma = createPrismaClient();
    const body = await request.json();
    const { title, description, start_date, end_date, place } = body;

    if (!title || !description || !start_date || !end_date || !place) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (new Date(start_date) >= new Date(end_date)) {
      return NextResponse.json(
          { message: 'Start date should be before the end date' },
          { status: 400 }
      )
    }

    const existingEvent = await prisma.event.findFirst({
      where: {
        title,
        place,
        start_date: new Date(start_date),
      }
    });

    if(existingEvent){
      return NextResponse.json(
          { message: `Un événement ${title} existe déjà à ${place} à cette date`},
          { status: 409 }
      )
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        place
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
