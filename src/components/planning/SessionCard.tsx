type Props = {
  title: string
  speaker: string
  start: string
  end: string
}

export default function SessionCard({
  title,
  speaker,
  start,
  end
}: Props) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl hover:bg-white/10 transition">

      <p className="text-xs text-purple-400">
        {start} - {end}
      </p>

      <h3 className="text-md font-semibold mt-2">
        {title}
      </h3>

      <p className="text-sm text-gray-400 mt-2">
        {speaker}
      </p>

    </div>
  )
}