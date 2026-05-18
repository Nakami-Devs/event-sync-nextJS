import { notFound } from 'next/navigation'
import Image from 'next/image'
import QuestionSection from './QuestionSection'

type Speaker = {
  id:          string
  full_name:   string
  profile_pic: string
  biography:   string
}

type SessionSpeaker = {
  speaker: Speaker
}

type Question = {
  id:                string
  content:           string
  name:              string
  upvote_numbers:    number
  creation_datetime: string
}

type Session = {
  id:          string
  title:       string
  description: string
  start_time:  string
  end_time:    string
  is_live:     boolean
  room:        { name: string; capacity: string }
  event:       { title: string }
  speakers:    SessionSpeaker[]
  questions:   Question[]
}

async function getSession(id: string): Promise<Session | null> {
  try {
    const res = await fetch(`http://localhost:3000/api/sessions/${id}`, {
      cache: 'no-store'
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('fr-FR', {
    hour:   '2-digit',
    minute: '2-digit'
  })
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day:   'numeric',
    month: 'long',
    year:  'numeric'
  })
}

function getSessionStatus(startTime: string, endTime: string): 'live' | 'termine' | 'a_venir' {
  const now   = new Date()
  const start = new Date(startTime)
  const end   = new Date(endTime)
  if (now >= start && now <= end) return 'live'
  if (now > end)                  return 'termine'
  return 'a_venir'
}

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id }  = await params
  const session = await getSession(id)

  if (!session) notFound()

  return (
    <main className="min-h-screen bg-[#12132A] text-white">
      <div className="max-w-4xl mx-auto px-6 py-8">

        
        {(() => {
  const status = getSessionStatus(session.start_time, session.end_time)
  if (status === 'live') return (
    <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
      LIVE
    </span>
  )
  if (status === 'termine') return (
    <span className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
      Terminée
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1.5 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
      À venir
    </span>
  )
})()}

       
        <h1 className="text-4xl font-bold text-white mb-4">
          {session.title}
        </h1>

        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-2">
          <span>📅 {formatDate(session.start_time)}</span>
          <span>🕐 {formatTime(session.start_time)} — {formatTime(session.end_time)}</span>
          <span>📍 {session.room.name}</span>
          {session.room.capacity && (
            <span>👥 {session.room.capacity} places</span>
          )}
        </div>

        <p className="text-gray-500 text-xs mb-8">
          Événement : {session.event.title}
        </p>

       
        <hr className="border-white/10 mb-8" />

        
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-2">Description</h2>
          <p className="text-gray-400 leading-relaxed">{session.description}</p>
        </div>

        
        {session.speakers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-4">Intervenants</h2>
            <div className="flex flex-col gap-3">
              {session.speakers.map(({ speaker }) => (
                <div
                  key={speaker.id}
                  className="flex items-center gap-4 bg-white/5 rounded-xl px-4 py-3"
                >
                  <Image
                    src={speaker.profile_pic}
                    alt={speaker.full_name}
                    width={44}
                    height={44}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-white">{speaker.full_name}</p>
                    <p className="text-sm text-gray-400">{speaker.biography}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        
        {session.is_live ? (
          <QuestionSection
            sessionId={session.id}
            initialQuestions={session.questions}
          />
        ) : (
          <p className="text-gray-500 text-sm text-center py-8">
            Les questions seront disponibles pendant la session.
          </p>
        )}

      </div>
    </main>
  )
}