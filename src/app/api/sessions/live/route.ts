import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')
    
    const now = new Date()
    
    const whereCondition: any = {
      start_time: { lte: now },
      end_time: { gte: now }
    }
    
    if (eventId) {
      whereCondition.eventId = eventId
    }
    
    const liveSessions = await prisma.session.findMany({
      where: whereCondition,
      include: {
        event: true,
        speakers: true,
        questions: {
          orderBy: {
            upvote_numbers: 'desc'
          },
          take: 5
        }
      }
    })
    
    const sessionsWithRemainingTime = liveSessions.map((session: any) => {
      const endTime = new Date(session.end_time)
      const remainingMinutes = Math.max(0, Math.floor((endTime.getTime() - now.getTime()) / 60000))
      const remainingHours = Math.floor(remainingMinutes / 60)
      const remainingMinutesOnly = remainingMinutes % 60
      
      return {
        ...session,
        remainingTime: {
          hours: remainingHours,
          minutes: remainingMinutesOnly,
          totalMinutes: remainingMinutes,
          formatted: remainingHours > 0 
            ? `${remainingHours}h ${remainingMinutesOnly}min` 
            : `${remainingMinutesOnly}min`
        },
        progress: {
          start: session.start_time,
          end: session.end_time,
          percentage: Math.min(100, Math.max(0, 
            ((now.getTime() - new Date(session.start_time).getTime()) / 
             (new Date(session.end_time).getTime() - new Date(session.start_time).getTime())) * 100
          ))
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: {
        liveSessions: sessionsWithRemainingTime,
        count: liveSessions.length,
        timestamp: now.toISOString()
      }
    })
  } catch (error) {
    console.error('Erreur lors de la détection des sessions live', error)
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}