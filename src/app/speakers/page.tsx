import Link from 'next/link'
import Navbar from '@/components/navbar/Navbar'
import { ArrowLeft } from 'lucide-react'

type Speaker = {
  id: string
  full_name: string
  profile_pic: string
  biography: string
  external_links: string
  sessions: Array<{ id: string }>
}

async function getSpeakers(): Promise<Speaker[]> {
  try {
    const res = await fetch('http://localhost:3000/api/speakers', { cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function SpeakersPage() {
  const speakers = await getSpeakers()

  return (
    <main className="min-h-screen" style={{ background: "var(--page-gradient)", color: "var(--foreground)" }}>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--card-bg)] hover:bg-[var(--card-hover)] transition-all duration-200 border border-[var(--card-border)]"
            title="Retour à l'accueil"
          >
            <ArrowLeft size={20} className="text-[var(--foreground)]" />
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            Intervenants
          </h1>
        </div>

        <p className="text-slate-500 dark:text-gray-400 mb-10">
          {speakers.length} intervenant{speakers.length > 1 ? 's' : ''} au total
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {speakers.map(speaker => (
            <Link key={speaker.id} href={`/speakers/${speaker.id}`}>
              <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-5 backdrop-blur-xl hover:scale-105 hover:border-violet-400 transition-all duration-300 cursor-pointer h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-r from-violet-500 to-fuchsia-500 p-0.5 flex-shrink-0">
                    <div className="w-full h-full rounded-full bg-[var(--card-bg)] p-0.5">
                      {speaker.profile_pic ? (
                        <img
                          src={speaker.profile_pic}
                          alt={speaker.full_name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-violet-200 dark:bg-violet-900 flex items-center justify-center text-xl font-bold text-violet-700 dark:text-white">
                          {speaker.full_name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-bold text-[var(--foreground)] text-base leading-tight">
                      {speaker.full_name}
                    </h2>
                    <p className="text-slate-500 dark:text-gray-400 text-sm mt-0.5">
                      {speaker.sessions?.length ?? 0} session{(speaker.sessions?.length ?? 0) > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
                  {speaker.biography || 'Aucune biographie disponible.'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}