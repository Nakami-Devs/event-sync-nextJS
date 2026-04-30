import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const upcoming = searchParams.get('upcoming') === 'true'
    
    const where = upcoming ? {
      endDate: {
        gte: new Date()
      }
    } : {}
    
    const events = await prisma.event.findMany({
      where,
      include: {
        sessions: {
          include: {
            speakers: true
          }
        }
      },
      orderBy: {
        startDate: 'asc'
      }
    })
    
    return NextResponse.json({
      success: true,
      data: events,
      count: events.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des événements' },
      { status: 500 }
    )
  }
}