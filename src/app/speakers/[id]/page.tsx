import { notFound } from "next/navigation";
import Link from "next/link";

type SpeakerSession = {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  event: { id: string; title: string };
  room: { name: string };
};

type SpeakerDetails = {
  id: string;
  full_name: string;
  profile_pic: string;
  biography: string;
  externalLinks: Array<string | { title?: string; url?: string }>;
  statistics: {
    totalSessions: number;
    totalQuestions: number;
    totalUpvotes: number;
    upcomingSessions: number;
    pastSessions: number;
  };
  sessions: {
    all: SpeakerSession[];
  };
};

async function getSpeaker(id: string): Promise<SpeakerDetails | null> {
  const res = await fetch(`http://localhost:3000/api/sessions/${id}`);
  if (!res.ok) return null;
  const payload = await res.json();
  return payload?.data ?? null;
};

function resolveLink(entry: string | { title?: string; url?: string }) {
  if (typeof entry === "string") {
    return { label: entry, url: entry };
  }

  return {
    label: entry.title ?? entry.url ?? "Lien",
    url: entry.url ?? entry.title ?? "#",
  };
}

export default async function SpeakerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const speakerData = await getSpeaker(id);

  if (!speakerData) {
    notFound();
  }

  const speaker = speakerData;
  const links = Array.isArray(speaker.externalLinks) ? speaker.externalLinks : [];
  const sessions = speaker.sessions?.all ?? [];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl space-y-10">
        <div className="mb-6">
          <Link 
            href="/speakers" 
            className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors"
          >
            ← Retour aux intervenants
          </Link>
        </div>

        <section className="grid gap-8 rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20 lg:grid-cols-[280px_1fr]">
          <div className="space-y-6 text-center">
            <img
              src={speaker.profile_pic}
              alt={speaker.full_name}
              className="mx-auto h-40 w-40 rounded-full border border-white/10 object-cover"
            />
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-purple-300/80">Intervenant</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">{speaker.full_name}</h1>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-slate-950/80 p-6 text-slate-300">
              <h2 className="text-xl font-semibold text-white">Bio</h2>
              <p className="mt-4 leading-7 text-slate-400">{speaker.biography}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-950/80 p-4 text-sm text-slate-300">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Sessions</p>
                <p className="mt-2 text-2xl font-semibold text-white">{speaker.statistics.totalSessions}</p>
              </div>
              <div className="rounded-2xl bg-slate-950/80 p-4 text-sm text-slate-300">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Questions</p>
                <p className="mt-2 text-2xl font-semibold text-white">{speaker.statistics.totalQuestions}</p>
              </div>
              <div className="rounded-2xl bg-slate-950/80 p-4 text-sm text-slate-300">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Upvotes</p>
                <p className="mt-2 text-2xl font-semibold text-white">{speaker.statistics.totalUpvotes}</p>
              </div>
            </div>

            {links.length > 0 && (
              <div className="rounded-3xl bg-slate-950/80 p-6 text-slate-300">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Liens</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {links.map((linkEntry, index) => {
                    const link = resolveLink(linkEntry);
                    return (
                      <a
                        key={`${link.url}-${index}`}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white transition hover:border-purple-400/40 hover:bg-slate-900"
                      >
                        {link.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-white">Sessions</h2>
            <p className="text-sm text-slate-400">{sessions.length} session{sessions.length > 1 ? "s" : ""}</p>
          </div>

          <div className="grid gap-4">
            {sessions.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-slate-400">
                Aucune session pour cet intervenant.
              </div>
            ) : (
              sessions.map((session) => {
                const start = new Date(session.start_time);
                const end = new Date(session.end_time);
                const timeFormat = new Intl.DateTimeFormat("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <Link
                    key={session.id}
                    href={`/sessions/${session.id}`}
                    className="block rounded-3xl border border-white/10 bg-slate-900/80 p-6 transition hover:border-purple-400/30 hover:bg-slate-900"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{session.event.title}</p>
                        <h3 className="mt-2 text-xl font-semibold text-white">{session.title}</h3>
                        <p className="mt-2 text-slate-400 line-clamp-2">{session.description}</p>
                      </div>
                      <div className="shrink-0 rounded-2xl bg-slate-950/80 px-4 py-3 text-right text-sm text-slate-300">
                        <div>{timeFormat.format(start)} - {timeFormat.format(end)}</div>
                        <div className="mt-2 text-slate-400">{session.room.name}</div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </section>
      </div>
    </main>
  );
}