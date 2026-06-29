import { Mic, ArrowLeft } from "lucide-react"
import Link from "next/link"
import SessionCard from "@/components/planning/SessionCard"

interface LiveSession {
  id: string
  title: string
  start_time: string
  end_time: string
  room?: { name: string }
  speakers: Array<{ speaker: { full_name: string } }>
}

async function getLiveSessions(): Promise<LiveSession[]> {
  try {
    const res = await fetch('http://localhost:3000/api/sessions/live', { cache: 'no-store' })
    if (!res.ok) return []
    const json = await res.json()
    return json?.data?.liveSessions ?? []
  } catch {
    return []
  }
}

export default async function LiveSessionsPage() {
  const sessions = await getLiveSessions()

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/" className="inline-flex items-center justify-center w-9 h-9 rounded-full mt-1
            bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-purple-400/50
            hover:bg-[var(--card-hover)] transition-all duration-200">
          <ArrowLeft size={18} className="text-gray-400" />
        </Link>

        <div className="relative">
          <Mic size={28} className="text-cyan-400" />
          {sessions.length > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
          )}
        </div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
          Sessions en cours
        </h1>
        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-[var(--badge-violet-bg)] text-[var(--badge-violet-text)]">
          {sessions.length}
        </span>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
          <Mic size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">Aucune session en cours pour le moment.</p>
          <Link href="/events" className="mt-4 inline-block text-purple-400 hover:underline text-sm">
            Voir tous les événements →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <Link href={`/sessions/${session.id}`} key={session.id}>
              <div className="rounded-2xl border border-purple-500/20 hover:border-cyan-400/50
                bg-[var(--card-bg)] backdrop-blur-xl hover:bg-[var(--card-hover)]
                hover:scale-[1.03] hover:shadow-lg hover:shadow-cyan-500/10
                transition-all duration-300 cursor-pointer">
                <SessionCard
                  title={session.title}
                  start={session.start_time}
                  end={session.end_time}
                  room={session.room?.name}
                  speaker={session.speakers.map(s => s.speaker?.full_name ?? "")}
                  isLive={true}
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}