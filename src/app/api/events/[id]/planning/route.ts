import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: {  params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const { searchParams } = new URL(request.url)
    const room = searchParams.get('room')
    
    const whereCondition: any = {
      id_event: id,
    }
    
    if (room) {
      whereCondition.id_room = room
    }

    const event = await prisma.event.findUnique({
      where: {id},
    })

    if(!event) {
      return NextResponse.json(
          { message: 'Événement non trouvé' },
          { status: 404 }
      )
    }
    
    const sessions = await prisma.session.findMany({
      where: whereCondition,
      include: {
        speakers: {
          include: {speaker: true}
        },
        room: true,
      },
      orderBy: [
        { start_time: 'asc' },
        { id_room: 'asc' }
      ]
    })
    
    const now = new Date()
    
    const planningByRoom = sessions.reduce<Record<string, any[]>>((acc: Record<string, any[]>, session: any) => {
      const roomName = session.room.name

      if (!acc[roomName]) {
        acc[roomName] = []
      }
      
      const isLive = now >= new Date(session.start_time) && now <= new Date(session.end_time)
      
      acc[roomName].push({
        ...session,
        isLive,
        timeSlot: `${new Date(session.start_time).toLocaleTimeString('fr-FR', { 
          hour: '2-digit', minute: '2-digit' 
        })} - ${new Date(session.end_time).toLocaleTimeString('fr-FR', {
          hour: '2-digit', minute: '2-digit' 
        })}`
      })
      
      return acc
    }, {} as Record<string, any[]>)
    
    Object.keys(planningByRoom).forEach((roomName) => {
      planningByRoom[roomName].sort((a: any, b: any) => 
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      )
    })
    
    return NextResponse.json({
      success: true,
      data: {
        eventId: { id},
        rooms: Object.keys(planningByRoom),
        planning: planningByRoom,
        currentTime: now.toISOString()
      }
    })
  } catch (error) {
    console.error('Erreur lors de la récupération du planning multi-track', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération du planning' },
      { status: 500 }
    )
  }
}