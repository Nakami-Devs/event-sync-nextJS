import { CalendarDays, Mic, Users } from "lucide-react"
import Link from "next/link"


async function getSpeakerCount(): Promise<number> {
  try {
    const res = await fetch('http://localhost:3000/api/speakers', {
      cache: 'no-store'
    })
    if (!res.ok) return 0
    const data = await res.json()
    return Array.isArray(data) ? data.length : 0
  } catch {
    return 0
  }
}

async function getEventCount(): Promise<number> {
  try {
    const res = await fetch('http://localhost:3000/api/events', {
      cache: 'no-store'
    })
    if (!res.ok) return 0
    const data = await res.json()
    return Array.isArray(data) ? data.length : 0
  } catch {
    return 0
  }
}

export default async function HeroSection() {
  const speakerCount = await getSpeakerCount()
  const eventCount = await getEventCount()

  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 sm:px-6">
      <div className="mb-6 px-4 py-2 rounded-full bg-purple-100/50 dark:bg-purple-500/10 border border-purple-200 
      dark:border-purple-500/20 backdrop-blur text-purple-100 dark:text-purple-400">
        Plateforme d'événements en temps réel
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold max-w-5xl leading-tight">
        <p
          className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          EventSync
        </p>
        <p style={{ color: "var(--hero-text)" }}>
          Vivez vos événements autrement
        </p>
      </h1>

      <p className="mt-6 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
        Naviguez dans le planning, identifiez les sessions en cours et interagissez avec les intervenants en temps réel.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 w-full max-w-5xl">
         <Link href="/events">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-4">
                <CalendarDays size={38} className="text-purple-400" />
              </div>
              <h2 className="text-3xl font-bold">{eventCount}</h2>
              <p className="text-gray-400 mt-2">Événements à venir</p>
            </div>
        </Link>

        <div className="rounded-3xl p-6 backdrop-blur-xl bg-white/70 dark:bg-white/5 border border-gray-200
        dark:border-white/10 shadow-xl dark:shadow-none transition hover:scale-105"
        >
          <div className="flex justify-center mb-4">
            <Mic
              size={38}
              className="text-cyan-500"
            />
          </div>
          <h2 className="text-3xl font-bold">
            24
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Sessions
          </p>
        </div>

        <Link href="/speakers">

          <div className="rounded-3xl p-6 backdrop-blur-xl bg-white/70 dark:bg-white/5 border border-gray-200
             dark:border-white/10 shadow-xl dark:shadow-none transition hover:scale-105">

            <div className="flex justify-center mb-4">
              <Users
                size={38}
                className="text-blue-500"
              />
            </div>

            <h2 className="text-3xl font-bold">
              {speakerCount}
            </h2>

            <p className="text-gray-600 dark:text-gray-400">
              Intervenants
            </p>
          </div>
        </Link>
      </div>
    </section>
  )
}