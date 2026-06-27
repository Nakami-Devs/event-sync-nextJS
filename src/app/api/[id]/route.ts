import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
)
{
  const { id } = await params

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        sessions: {
          include: {
            speakers: true,
            questions: {
              orderBy: {
                upvote_numbers: 'desc'
              }
            }
          },
          orderBy: {
            start_time: 'asc'
          }
        }
      }
    })

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      )
    }

    const now = new Date()

    const sessionsWithLiveStatus = event.sessions.map((session: (typeof event.sessions)[number]) => ({
      ...session,
      isLive:
        now >= new Date(session.start_time) &&
        now <= new Date(session.end_time)
    }))

    return NextResponse.json({
      success: true,
      data: {
        ...event,
        sessions: sessionsWithLiveStatus
      }
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error while retrieving event' },
      { status: 500 }
    )
  }
}