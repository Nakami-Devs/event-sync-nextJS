import SessionCard from "./SessionCard"
import { rooms, sessions } from "./MockData"

export default function PlanningGrid() {

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">

      <h1 className="text-4xl font-bold mb-10 text-center">
        Évènements
      </h1>
      <div className="flex gap-6 overflow-x-auto md:grid md:grid-cols-3 md:overflow-x-visible">
        {rooms.map((room) => (
          <div key={room} className="min-w-[300px] md:min-w-0 bg-white/5 border border-white/10 rounded-3xl p-5 flex-shrink-0">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              {room}
            </h2>

            <div className="space-y-4">
              {sessions
                .filter((session) => session.room === room)
                .map((session) => (
                  <SessionCard
                    key={session.id}
                    title={session.title}
                    speaker={session.speaker}
                    start={session.start}
                    end={session.end}
                  />
                ))}
            </div>
          </div>

        ))}

      </div>

    </section>
  )
}