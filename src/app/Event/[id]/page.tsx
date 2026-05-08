import { notFound } from 'next/navigation';
import PublicLayout from '@/components/sections/PublicLayout';
import { EVENTS, SESSIONS, isSessionLive } from '@/lib/mockData';

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const event = EVENTS?.find(e => e.id === id);
  
  if (!event) {
    notFound();
  }

  const sessions = SESSIONS?.filter(s => s.eventId === id) || [];
  const liveSessions = sessions.filter(isSessionLive);

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const dateFormat = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto">
        {/* En-tête de l'événement */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{event.title}</h1>
          <p className="text-lg text-muted-foreground mt-2">{event.description}</p>
          
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{dateFormat.format(startDate)} - {dateFormat.format(endDate)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        {/* Badge sessions en direct */}
        {liveSessions.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 live-pulse" />
              <span className="font-semibold text-red-700 dark:text-red-400">
                {liveSessions.length} session(s) en cours
              </span>
            </div>
          </div>
        )}

        {/* Liste des sessions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Programme</h2>
          
          {sessions.length === 0 ? (
            <p className="text-muted-foreground">Aucune session prévue pour cet événement.</p>
          ) : (
            sessions.map(session => {
              const isLive = isSessionLive(session);
              const startTime = new Date(session.startTime);
              const endTime = new Date(session.endTime);
              const timeFormat = new Intl.DateTimeFormat('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <a
                  key={session.id}
                  href={`/session-detail-page?id=${session.id}`}
                  className="block p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {isLive && (
                          <span className="text-xs font-semibold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-red-500" />
                            LIVE
                          </span>
                        )}
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {session.room.name}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {session.track}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground">{session.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {session.description}
                      </p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground shrink-0">
                      <div>{timeFormat.format(startTime)} - {timeFormat.format(endTime)}</div>
                    </div>
                  </div>
                  
                  {/* Intervenants */}
                  {session.speakers.length > 0 && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                      <div className="flex -space-x-2">
                        {session.speakers.slice(0, 3).map(speaker => (
                          <img
                            key={speaker.id}
                            src={speaker.avatar}
                            alt={speaker.name}
                            className="w-6 h-6 rounded-full border-2 border-card"
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {session.speakers.map(s => s.name).join(', ')}
                      </span>
                    </div>
                  )}
                </a>
              );
            })
          )}
        </div>
      </div>
    </PublicLayout>
  );
}