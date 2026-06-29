"use client"

import SessionCard from "./SessionCard"
import { useSessions } from "@/hooks/useSessions"
import { Session } from "@/types"
import { getSpeakerNames, groupSessionsByDayAndRoom, isSessionLive } from "@/lib/utils/session"

export default function PlanningGrid({ eventId }: { eventId: string }) {
  const { sessions, loading } = useSessions(eventId)
  const days = groupSessionsByDayAndRoom(sessions)

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-10 text-center text-[var(--foreground)]">
        Planning
      </h1>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
        </div>
      ) : days.length === 0 ? (
        <p className="text-center text-slate-500 dark:text-gray-400">
          Aucune session pour cet événement
        </p>
      ) : (
        <div className="flex flex-col gap-12">
          {days.map((day) => (
            <div key={day.dateKey}>
              <h2 className="text-2xl font-bold mb-6 text-purple-600 dark:text-purple-400 border-b border-[var(--card-border)] pb-3">
                {day.label}
              </h2>
              <div className="flex gap-6 overflow-x-auto md:grid md:grid-cols-3 md:overflow-x-visible">
                {day.rooms.map((roomGroup) => (
                  <div
                    key={roomGroup.roomId}
                    className="min-w-[300px] md:min-w-0 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl p-5 flex-shrink-0 backdrop-blur-xl"
                  >
                    <h3 className="text-xl font-semibold mb-6 text-center text-[var(--foreground)]">
                      {roomGroup.roomName}
                    </h3>
                    <div className="space-y-4">
                      {roomGroup.sessions.map((session: Session) => (
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
      )}
    </section>
  )
}