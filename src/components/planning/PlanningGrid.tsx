"use client"
import SessionCard from "./SessionCard"
import { useSessions } from "@/hooks/useSessions"
import { useEffect, useState } from "react"
import { Room, Session } from "@/types"
import { getRooms } from "@/lib/api/rooms"
import { getSpeakerNames, groupSessionsByDayAndRoom, isSessionLive } from "@/lib/utils/session"

export default function PlanningGrid({ eventId }: { eventId: string }) {
  const { sessions, loading } = useSessions(eventId)

  const days = groupSessionsByDayAndRoom(sessions);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">

      <h1 className="text-4xl font-bold mb-10 text-center">
        Événements
      </h1>
      {loading ? (<p>Chargement...</p>)
        : days.length === 0 ? (
          <p className="text-center text-gray-400">Aucune session pour cet événement</p>
        ) : (
          <div className="flex flex-col gap-12">
            {days.map((day) => (
              <div key={day.dateKey}>
                <h2 className="text-2xl font-bold mb-6 text-purple-400 border-b border-white/10 pb-3">
                  {day.label}
                </h2>

                <div className="flex gap-6 overflow-x-auto md:grid md:grid-cols-3 md:overflow-x-visible">
                  {day.rooms.map((roomGroup) => (
                    <div
                      key={roomGroup.roomId}
                      className="min-w-[300px] md:min-w-0 bg-white/5 border border-white/10 rounded-3xl p-5 flex-shrink-0"
                    >
                      <h3 className="text-xl font-semibold mb-6 text-center">
                        {roomGroup.roomName}
                      </h3>

                      <div className="space-y-4">
                        {roomGroup.sessions
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

              </div>

            ))}

          </div>
        )
      }
    </section>
  )
}