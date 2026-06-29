import { Mic } from "lucide-react"
import Link from "next/link"

async function getLiveCount(): Promise<number> {
  try {
    const res = await fetch('http://localhost:3000/api/sessions/live', { cache: 'no-store' })
    if (!res.ok) return 0
    const json = await res.json()
    return json?.data?.count ?? 0
  } catch {
    return 0
  }
}

export default async function LiveSessionsCard() {
  const count = await getLiveCount()

  return (
    <Link href="/sessions/live">
      <div className="rounded-3xl p-6 backdrop-blur-xl bg-[var(--card-bg)] border border-[var(--card-border)]
        shadow-xl transition hover:scale-105 hover:bg-[var(--card-hover)] duration-300">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Mic size={38} className="text-cyan-400" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            )}
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center">{count}</h2>
        <p className="text-[color:var(--foreground)] opacity-70 text-center">Sessions en cours</p>
      </div>
    </Link>
  )
}