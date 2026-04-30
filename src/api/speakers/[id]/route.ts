export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const speaker = await prisma.speaker.findUnique({
      where: { id: params.id },
      include: {
        sessions: {
          include: {
            event: {
              select: {
                id: true,
                title: true,
                startDate: true,
                endDate: true
              }
            },
            questions: {
              select: {
                id: true,
                content: true,
                upvotes: true,
                createdAt: true
              },
              orderBy: {
                upvotes: 'desc'
              },
              take: 10
            }
          },
          orderBy: {
            startTime: 'asc'
          }
        }
      }
    })
    
    if (!speaker) {
      return NextResponse.json(
        { success: false, error: 'Intervenant non trouvé' },
        { status: 404 }
      )
    }
    
    let externalLinks = []
    if (speaker.externalLinks) {
      try {
        externalLinks = JSON.parse(speaker.externalLinks)
      } catch {
        externalLinks = []
      }
    }
    
    const totalSessions = speaker.sessions.length
    const totalQuestions = speaker.sessions.reduce(
      (sum, session) => sum + session.questions.length, 
      0
    )
    const totalUpvotes = speaker.sessions.reduce(
      (sum, session) => sum + session.questions.reduce(
        (qSum, q) => qSum + q.upvotes, 0
      ), 
      0
    )
    
    const now = new Date()
    const upcomingSessions = speaker.sessions.filter(
      session => new Date(session.startTime) > now
    )
    const pastSessions = speaker.sessions.filter(
      session => new Date(session.endTime) < now
    )
    
    return NextResponse.json({
      success: true,
      data: {
        ...speaker,
        externalLinks,
        statistics: {
          totalSessions,
          totalQuestions,
          totalUpvotes,
          upcomingSessions: upcomingSessions.length,
          pastSessions: pastSessions.length
        },
        sessions: {
          upcoming: upcomingSessions,
          past: pastSessions,
          all: speaker.sessions
        }
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération de l\'intervenant' },
      { status: 500 }
    )
  }
}