"use client"
import SessionCard from "./SessionCard"
import { useSessions } from "@/hooks/useSessions"
import { useEffect, useState } from "react"
import { Room, Session } from "@/types"
import { getRooms } from "@/lib/api/rooms"
import { getSpeakerNames, isSessionLive } from "@/lib/utils/session"

export default function PlanningGrid({eventId}: {eventId: string}) {
  const { sessions, loading } = useSessions(eventId)
  const [rooms, setRooms] = useState<Room[]>([])

  useEffect(() => {
    getRooms().then(setRooms)
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">

      <h1 className="text-4xl font-bold mb-10 text-center">
        Événements
      </h1>
      {loading ? (<p>Chargement...</p>) :
        <div className="flex gap-6 overflow-x-auto md:grid md:grid-cols-3 md:overflow-x-visible">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="min-w-[300px] md:min-w-0 bg-white/5 border border-white/10 rounded-3xl p-5 flex-shrink-0"
            >

              <h2 className="text-2xl font-semibold mb-6 text-center">
                {room.name}
              </h2>

              <div className="space-y-4">

                {sessions
                  .filter((session: { id_room: string }) => session.id_room === room.id)
                  .map((session: Session) => (

                    <SessionCard
                      key={session.id}
                      title={session.title}
                      start={session.start_time}
                      end={session.end_time}
                      room={session.room.name}
                      speaker={getSpeakerNames(session.speakers)}
                      isLive={isSessionLive(session.start_time, session.end_time)}
                    />

                  ))}

              </div>

            </div>

          ))}

        </div>
      }
    </section>
  )
}