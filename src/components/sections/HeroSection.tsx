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

export default async function HeroSection() {
  const speakerCount = await getSpeakerCount()

  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 sm:px-6">
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold max-w-4xl leading-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        <p>EventSync</p>
        <p>vivez votre événement autrement</p>
      </h1>

      <p className="mt-6 text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed">
        Naviguez dans le planning, identifiez les sessions en cours
        et interagissez avec les intervenants en temps réel.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 w-full max-w-5xl">

       
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:scale-105 transition-all duration-300">
          <div className="flex justify-center mb-4">
            <CalendarDays size={38} className="text-purple-400" />
          </div>
          <h2 className="text-3xl font-bold">8</h2>
          <p className="text-gray-400 mt-2">Événements à venir</p>
        </div>

       
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:scale-105 transition-all duration-300">
          <div className="flex justify-center mb-4">
            <Mic size={38} className="text-pink-400" />
          </div>
          <h2 className="text-3xl font-bold">24</h2>
          <p className="text-gray-400 mt-2">Sessions en cours</p>
        </div>

        
        <Link href="/speakers">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:scale-105 hover:border-blue-400 transition-all duration-300 cursor-pointer">
            <div className="flex justify-center mb-4">
              <Users size={38} className="text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold">{speakerCount}</h2>
            <p className="text-gray-400 mt-2">Intervenants</p>
          </div>
        </Link>

      </div>
    </section>
  )
}