import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import QuestionSection from './QuestionSection'

type Speaker = {
  id: string
  full_name: string
  profile_pic: string
  biography: string
}

type SessionSpeaker = {
  speaker?: Speaker | null
}

type Question = {
  id: string
  content: string
  name: string
  upvote_numbers: number
  creation_datetime: string
}

type Session = {
  id: string
  title: string
  description: string
  start_time: string
  end_time: string
  is_live: boolean
  room?: { name: string; capacity: string } | null
  event?: { title: string } | null
  speakers: SessionSpeaker[]
  questions: Question[]
}

async function getSession(id: string): Promise<Session | null> {
  try {
    const res = await fetch(`http://localhost:3000/api/sessions/${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function getSessionStatus(startTime: string, endTime: string): 'live' | 'termine' | 'a_venir' {
  const now = new Date()
  const start = new Date(startTime)
  const end = new Date(endTime)
  if (now >= start && now <= end) return 'live'
  if (now > end) return 'termine'
  return 'a_venir'
}

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getSession(id)

  if (!session) notFound()

  const status = getSessionStatus(session.start_time, session.end_time)

  return (
  <main className="min-h-screen text-[var(--foreground)]">
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div
        className="
          rounded-3xl
          border
          border-[var(--card-border)]
          bg-[var(--card-bg)]
          backdrop-blur-xl
          p-8
          shadow-xl
        "
      >
        {status === "live" && (
          <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            LIVE
          </span>
        )}

        {status === "termine" && (
          <span className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
            Terminée
          </span>
        )}

        {status === "a_venir" && (
          <span className="inline-flex items-center gap-1.5 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
            À venir
          </span>
        )}

        <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
          {session.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-[color:var(--foreground)]/70 mb-2">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-purple-400" />
            {formatDate(session.start_time)}
          </span>

          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-cyan-400" />
            {formatTime(session.start_time)} — {formatTime(session.end_time)}
          </span>

          {session.room && (
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-blue-400" />
              {session.room.name}
            </span>
          )}

          {session.room?.capacity && (
            <span className="flex items-center gap-1.5">
              <Users size={14} className="text-green-400" />
              {session.room.capacity} places
            </span>
          )}
        </div>

        {session.event && (
          <p className="text-[color:var(--foreground)]/60 text-xs mb-8">
            Événement : {session.event.title}
          </p>
        )}

        <hr className="border-[var(--card-border)] mb-8" />

        <div className="mb-8">
          <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">
            Description
          </h2>

          <p className="text-[color:var(--foreground)]/70 leading-relaxed">
            {session.description}
          </p>
        </div>

        {session.speakers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">
              Intervenants
            </h2>

            <div className="flex flex-col gap-4">
              {session.speakers.map(({ speaker }, index) => {
                if (!speaker) return null;

                return (
                  <div
                    key={speaker.id ?? index}
                    className="
                      flex
                      items-center
                      gap-4
                      rounded-2xl
                      border
                      border-[var(--card-border)]
                      bg-[var(--card-bg)]
                      backdrop-blur-xl
                      px-4
                      py-4
                      transition-all
                      duration-300
                      hover:bg-[var(--card-hover)]
                    "
                  >
                    <Image
                      src={speaker.profile_pic || "/placeholder.png"}
                      alt={speaker.full_name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />

                    <div>
                      <p className="font-semibold text-[var(--foreground)]">
                        {speaker.full_name}
                      </p>

                      <p className="text-sm text-[color:var(--foreground)]/65">
                        {speaker.biography}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {session.is_live ? (
          <QuestionSection
            sessionId={session.id}
            initialQuestions={session.questions}
          />
        ) : (
          <p className="text-[color:var(--foreground)]/60 text-sm text-center py-8">
            Les questions seront disponibles pendant la session.
          </p>
        )}
      </div>
    </div>
  </main>
)};