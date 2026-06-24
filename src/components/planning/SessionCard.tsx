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


export default function SessionCard({
  title,
  start,
  end,
  room,
  speaker,
  isLive = false
}: Props) {

  return (
    <div className="relative bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl hover:bg-white/10 transition">

      {isLive && (
        <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
          LIVE
        </span>
      )}

      <p className="text-xs text-purple-400">
        {formatTime(start)} - {formatTime(end)}
      </p>

      <h3 className="text-md font-semibold mt-2">
        {title}
      </h3>

      {room && (
        <p className="text-sm text-gray-400 mt-1">
          {room}
        </p>
      )}

      <p className="text-sm text-gray-400 mt-2">
        👤 {speaker}
      </p>

    </div>
  )
}