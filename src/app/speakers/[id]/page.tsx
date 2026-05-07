import { notFound } from 'next/navigation';
import PublicLayout from '@/components/PublicLayout';
import { SPEAKERS, SESSIONS, isSessionLive } from '@/lib/mockData';

interface SpeakerPageProps {
  params: Promise<{ id: string }>;
}

export default async function SpeakerPage({ params }: SpeakerPageProps) {
  const { id } = await params;
  const speaker = SPEAKERS?.find(s => s.id === id);
  
  if (!speaker) {
    notFound();
  }

  const sessions = SESSIONS?.filter(s => 
    s.speakers.some(sp => sp.id === id)
  ) || [];

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto">
        {}
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          <img
            src={speaker.avatar}
            alt={speaker.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{speaker.name}</h1>
            <p className="text-lg text-primary font-medium mt-1">
              {speaker.title} @ {speaker.company}
            </p>
            <p className="text-muted-foreground mt-4">{speaker.bio}</p>
            
            {/* Liens externes */}
            <div className="flex gap-3 mt-4">
              {speaker.twitter && (
                <a
                  href={speaker.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.81zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}
              {speaker.linkedin && (
                <a
                  href={speaker.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              )}
              {speaker.website && (
                <a
                  href={speaker.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Sessions</h2>
          
          {sessions.length === 0 ? (
            <p className="text-muted-foreground">Aucune session prévue pour cet intervenant.</p>
          ) : (
            sessions.map(session => {
              const isLive = isSessionLive(session);
              const startTime = new Date(session.startTime);
              const timeFormat = new Intl.DateTimeFormat('fr-FR', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
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
                      </div>
                      <h3 className="font-semibold text-foreground">{session.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {timeFormat.format(startTime)}
                      </p>
                    </div>
                  </div>
                </a>
              );
            })
          )}
        </div>
      </div>
    </PublicLayout>
  );
}