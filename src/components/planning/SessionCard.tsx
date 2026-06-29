import { Clock, MapPin, User } from "lucide-react"

type Props = {
  title: string
  start: string
  end: string
  room?: string
  speaker: string | string[]
  isLive?: boolean
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function SessionCard({ title, start, end, room, speaker, isLive = false }: Props) {
  return (
    <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-4 backdrop-blur-xl hover:bg-[var(--card-hover)] transition">
      {isLive && (
        <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
          LIVE
        </span>
      )}
      <p className="text-xs text-purple-500 dark:text-purple-400 flex items-center gap-1">
        <Clock size={12} /> {formatTime(start)} - {formatTime(end)}
      </p>
      <h3 className="text-md font-semibold mt-2 text-[var(--foreground)]">
        {title}
      </h3>
      {room && (
        <p className="text-sm text-slate-500 dark:text-gray-400 mt-1 flex items-center gap-1">
          <MapPin size={12} className="text-blue-400" /> {room}
        </p>
      )}
      <p className="text-sm text-slate-500 dark:text-gray-400 mt-2 flex items-center gap-1">
        <User size={12} className="text-purple-400" /> {speaker}
      </p>
    </div>
  )
}