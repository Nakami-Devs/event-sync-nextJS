"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

type Speaker = {
  id: string;
  full_name: string;
  profile_pic: string;
  biography: string;
};

type SessionSpeaker = {
  id_speaker: string;
  id_session: string;
  speaker: Speaker;
};

type Room = {
  id: string;
  name: string;
  capacity: string;
};

type EventType = {
  id: string;
  title: string;
  description: string;
};

type Session = {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  id_event: string;
  id_room: string;
  room: Room;
  event: EventType;
  speakers: SessionSpeaker[];
};

type EventData = {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  place: string;
  sessions: Session[];
};

export default function EventPage() {
  const params = useParams();
  const eventId = params?.id as string;

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const isDark = theme === "dark";

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/${eventId}`);
        if (!response.ok) throw new Error("Événement non trouvé");
        const data = await response.json();
        setEvent(data.data || data);
      } catch (error) {
        console.error("Erreur lors du chargement de l'événement:", error);
        const mockEvent: EventData = {
          id: eventId,
          title: "Test Live",
          description: "fdhrtydhhrtf",
          start_date: "2026-05-04T00:00:00Z",
          end_date: "2026-05-05T23:59:59Z",
          place: "HEI Ivandry, Antananarivo",
          sessions: [
            {
              id: "sess1",
              title: "Live Test",
              description: "dgdthyhtht",
              start_time: "2026-05-04T09:00:00Z",
              end_time: "2026-05-04T20:00:00Z",
              id_event: eventId,
              id_room: "room1",
              room: {
                id: "room1",
                name: "Rooftop",
                capacity: "500"
              },
              event: {
                id: eventId,
                title: "Test Live",
                description: "fdhrtydhhrtf"
              },
              speakers: [
                {
                  id_speaker: "sp1",
                  id_session: "sess1",
                  speaker: { id: "sp1", full_name: "Nelio Giovanni", profile_pic: "/avatars/nelio.jpg", biography: "Speaker" }
                },
                {
                  id_speaker: "sp2",
                  id_session: "sess1",
                  speaker: { id: "sp2", full_name: "RANDRIANASOLO Finoana", profile_pic: "/avatars/finoana.jpg", biography: "Speaker" }
                },
                {
                  id_speaker: "sp3",
                  id_session: "sess1",
                  speaker: { id: "sp3", full_name: "Fanamby Fitia", profile_pic: "/avatars/fanamby.jpg", biography: "Speaker" }
                },
                {
                  id_speaker: "sp4",
                  id_session: "sess1",
                  speaker: { id: "sp4", full_name: "Maherison Koloina", profile_pic: "/avatars/koloina.jpg", biography: "Speaker" }
                },
              ]
            }
          ]
        };
        setEvent(mockEvent);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const formatDate = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString('fr-FR')} — ${end.toLocaleDateString('fr-FR')}`;
  };

  const formatTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return `${start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} — ${end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-slate-950 text-white" : "bg-gradient-to-b from-violet-50 via-fuchsia-50 to-slate-100"}`}>
        Chargement...
      </div>
    );
  }

  if (!event) {
    return (
      <div className={`min-h-screen flex items-center justify-center text-red-500 ${isDark ? "bg-slate-950" : "bg-gradient-to-b from-violet-50 via-fuchsia-50 to-slate-100"}`}>
        Événement non trouvé
      </div>
    );
  }

  return (
    <main className={isDark ? "min-h-screen bg-slate-950 text-slate-100" : "min-h-screen bg-gradient-to-b from-violet-50 via-fuchsia-50 to-slate-100 text-slate-900"}>
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className={isDark ? "grid h-12 w-12 place-items-center rounded-3xl bg-violet-500 text-slate-950 shadow-[0_20px_50px_rgba(167,139,250,0.3)]" : "grid h-12 w-12 place-items-center rounded-3xl bg-violet-600 text-white shadow-lg"}>
              ⚡
            </div>
            <span className="text-lg font-semibold">EventSync</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link href="#" className={isDark ? "text-slate-300 hover:text-white" : "text-slate-700 hover:text-slate-900"}>
              Événements
            </Link>
            <Link href="#" className={isDark ? "text-slate-300 hover:text-white" : "text-slate-700 hover:text-slate-900"}>
              Favoris
            </Link>
            <Link href="#" className={isDark ? "text-slate-300 hover:text-white" : "text-slate-700 hover:text-slate-900"}>
              Admin
            </Link>
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={isDark ? "rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 transition hover:border-slate-500" : "rounded-full border border-slate-300 bg-white px-3 py-2 text-slate-900 transition hover:border-slate-400"}
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          </nav>
        </header>

        <section className={isDark ? "mt-10 rounded-[2rem] bg-slate-900/95 p-10 shadow-2xl shadow-slate-950/40" : "mt-10 rounded-[2rem] bg-white/80 p-10 shadow-2xl backdrop-blur-xl"}>
          <h1 className="text-5xl font-bold tracking-tight">{event.title}</h1>
          <p className={isDark ? "mt-4 max-w-2xl text-slate-300" : "mt-4 max-w-2xl text-slate-600"}>{event.description}</p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <span className={isDark ? "inline-flex items-center gap-2 rounded-2xl bg-slate-800/80 px-4 py-3 text-sm text-slate-200 shadow-sm" : "inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700 shadow-sm"}>
              📅 {formatDate(event.start_date, event.end_date)}
            </span>
            <span className={isDark ? "inline-flex items-center gap-2 rounded-2xl bg-slate-800/80 px-4 py-3 text-sm text-slate-200 shadow-sm" : "inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700 shadow-sm"}>
              📍 {event.place}
            </span>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <button className="rounded-3xl bg-violet-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-violet-700">
              Voir le planning
            </button>
            <button className={isDark ? "rounded-3xl border border-slate-700 bg-slate-900 px-8 py-4 text-base font-semibold text-slate-100 transition hover:bg-slate-800" : "rounded-3xl border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-800 transition hover:bg-slate-50"}>
              Rooftop
            </button>
          </div>
        </section>

        <section className="mt-12 max-w-4xl">
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <span className={isDark ? "rounded-full bg-rose-600/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-rose-200" : "rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-rose-700"}>
              LIVE
            </span>
            <h2 className="text-2xl font-semibold text-inherit">Sessions en cours ({event.sessions.length})</h2>
          </div>

          {event.sessions.map((session) => (
            <article key={session.id} className={isDark ? "overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-500 via-orange-400 to-orange-300 p-8 text-slate-950 shadow-2xl shadow-slate-950/40 mb-8" : "overflow-hidden rounded-[2rem] bg-gradient-to-br from-amber-200 via-orange-200 to-amber-100 p-8 shadow-2xl mb-8"}>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <h3 className={isDark ? "text-3xl font-semibold text-slate-950" : "text-3xl font-semibold"}>{session.title}</h3>
                  <p className={isDark ? "mt-3 text-slate-900/70" : "mt-3 text-slate-700"}>{session.description}</p>
                  <div className="mt-4 flex gap-2 flex-wrap">
                    <span className={isDark ? "inline-flex items-center gap-1 rounded-full bg-slate-800/40 px-3 py-1 text-xs font-semibold text-slate-950" : "inline-flex items-center gap-1 rounded-full bg-white/40 px-3 py-1 text-xs font-semibold text-slate-700"}>
                      Event: {session.id_event}
                    </span>
                    <span className={isDark ? "inline-flex items-center gap-1 rounded-full bg-slate-800/40 px-3 py-1 text-xs font-semibold text-slate-950" : "inline-flex items-center gap-1 rounded-full bg-white/40 px-3 py-1 text-xs font-semibold text-slate-700"}>
                      Room: {session.id_room}
                    </span>
                  </div>
                </div>
                <button className={isDark ? "self-start rounded-full bg-white/90 px-5 py-3 text-sm font-semibold text-rose-600 shadow-sm hover:bg-white" : "self-start rounded-full bg-white/90 px-5 py-3 text-sm font-semibold text-rose-600 shadow-sm hover:bg-white"}>
                  ♥
                </button>
              </div>

              <div className={isDark ? "mt-8 flex flex-wrap gap-3 text-sm text-slate-950" : "mt-8 flex flex-wrap gap-3 text-sm text-slate-700"}>
                <span className="inline-flex items-center gap-2 rounded-2xl bg-white/80 px-4 py-3">
                  🕒 {formatTime(session.start_time, session.end_time)}
                </span>
                <span className="inline-flex items-center gap-2 rounded-2xl bg-white/80 px-4 py-3">
                  📍 {session.room.name}
                </span>
                <span className="inline-flex items-center gap-2 rounded-2xl bg-white/80 px-4 py-3">
                  👥 {session.room.capacity}
                </span>
              </div>

              <div className="mt-8 grid gap-4">
                {session.speakers.map(({ speaker }) => (
                  <Link href={`/speakers/${speaker.id}`} key={speaker.id}>
                    <div className={isDark ? "flex items-center gap-4 rounded-3xl bg-white/90 p-4 shadow-sm transition hover:bg-white cursor-pointer" : "flex items-center gap-4 rounded-3xl bg-white/90 p-4 shadow-sm transition hover:bg-white cursor-pointer"}>
                      <img
                        src={speaker.profile_pic}
                        alt={speaker.full_name}
                        className="h-14 w-14 rounded-full object-cover bg-violet-600"
                      />
                      <div>
                        <p className="font-semibold text-slate-900">{speaker.full_name}</p>
                        <p className={isDark ? "text-sm text-slate-700" : "text-sm text-slate-500"}>{speaker.biography}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}