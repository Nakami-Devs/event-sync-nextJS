
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        sessions: {
          include: {
            speakers: true,
            questions: {
              orderBy: {
                upvotes: 'desc'
              }
            }
          },
          orderBy: {
            startTime: 'asc'
          }
        }
      }
    })
    
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Événement non trouvé' },
        { status: 404 }
      )
    }
    
    const now = new Date()
    const sessionsWithLiveStatus = event.sessions.map(session => ({
      ...session,
      isLive: now >= new Date(session.startTime) && now <= new Date(session.endTime)
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
      { success: false, error: 'Erreur lors de la récupération de l\'événement' },
      { status: 500 }
    )
  }
}
