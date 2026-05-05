import { notFound } from 'next/navigation'
import Image from 'next/image'    
import QuestionSection from './QuestionSection'

type Speaker = {
  id:         string
  full_name:  string
  profile_pic: string
  biography:  string
}

type SessionSpeaker = {
  speaker: Speaker
}

type Question = {
  id:             string
  content:        string
  name:           string
  upvote_numbers: number
}

type Session = {
  id:          string
  title:       string
  description: string
  start_time:  string
  end_time:    string
  is_live:     boolean
  room:        { name: string }
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

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id }  = await params
  const session = await getSession(id)

  if (!session) notFound()

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">

      <div className="mb-6">

        {session.is_live && (
          <span className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
            🔴 Live
          </span>
        )}

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {session.title}
        </h1>

        <p className="text-gray-500 text-sm mb-1">
          📅 {formatTime(session.start_time)} – {formatTime(session.end_time)}
          &nbsp;·&nbsp;
          📍 {session.room.name}
        </p>

        <p className="text-gray-400 text-xs mb-4">
          Événement : {session.event.title}
        </p>

        <p className="text-gray-700 leading-relaxed">
          {session.description}
        </p>
      </div>

      {session.speakers.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Intervenants
          </h2>
          <div className="flex flex-col gap-3">
            {session.speakers.map(({ speaker }) => (
              <div key={speaker.id} className="flex items-center gap-3">
                <Image
                  src={speaker.profile_pic}
                  alt={speaker.full_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">{speaker.full_name}</p>
                  <p className="text-sm text-gray-500">{speaker.biography}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <hr className="my-8 border-gray-200" />

      {session.is_live ? (
        <QuestionSection
          sessionId={session.id}
          initialQuestions={session.questions}
        />
      ) : (
        <p className="text-gray-400 text-sm text-center">
          Les questions seront disponibles pendant la session.
        </p>
      )}

    </main>
  )
}