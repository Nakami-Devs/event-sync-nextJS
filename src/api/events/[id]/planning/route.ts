export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const room = searchParams.get('room')
    
    const whereCondition: any = {
      eventId: params.id
    }
    
    if (room) {
      whereCondition.room = room
    }
    
    const sessions = await prisma.session.findMany({
      where: whereCondition,
      include: {
        speakers: true
      },
      orderBy: [
        { startTime: 'asc' },
        { room: 'asc' }
      ]
    })
    
    const now = new Date()
    
    const planningByRoom = sessions.reduce((acc, session) => {
      if (!acc[session.room]) {
        acc[session.room] = []
      }
      
      const isLive = now >= new Date(session.startTime) && now <= new Date(session.endTime)
      
      acc[session.room].push({
        ...session,
        isLive,
        timeSlot: `${new Date(session.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${new Date(session.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
      })
      
      return acc
    }, {} as Record<string, any[]>)
    
    Object.keys(planningByRoom).forEach(roomName => {
      planningByRoom[roomName].sort((a, b) => 
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      )
    })
    
    return NextResponse.json({
      success: true,
      data: {
        eventId: params.id,
        rooms: Object.keys(planningByRoom),
        planning: planningByRoom,
        currentTime: now.toISOString()
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération du planning' },
      { status: 500 }
    )
  }
}
