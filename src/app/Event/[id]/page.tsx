"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";

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

type Session = {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  room: {
    id: string;
    name: string;
    capacity: string;
  };
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

type PlanningSession = {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  room: string;
  speakers: SessionSpeaker[];
  isLive: boolean;
  timeSlot: string;
};

type PlanningData = {
  success: boolean;
  data: {
    eventId: string;
    rooms: string[];
    planning: Record<string, PlanningSession[]>;
    currentTime: string;
  };
};

export default function EventPage() {
  const params = useParams();
  const eventId = params?.id as string;
  
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [event, setEvent] = useState<EventData | null>(null);
  const [planning, setPlanning] = useState<PlanningData | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"sessions" | "planning">("sessions");
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const isDark = theme === "dark";
  const now = new Date();
  const liveSessions = event?.sessions.filter((session) => now >= new Date(session.start_time) && now <= new Date(session.end_time)) ?? [];

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) {
          throw new Error("Erreur lors du chargement de l'événement");
        }
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Erreur lors du chargement de l'événement:", error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  useEffect(() => {
    const fetchPlanning = async () => {
      try {
        let url = `/api/events/${eventId}/planning`;
        if (selectedRoom) {
          url += `?room=${selectedRoom}`;
        }
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setPlanning(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du planning:", error);
      }
    };

    if (eventId && view === "planning") {
      fetchPlanning();
    }
  }, [eventId, view, selectedRoom]);

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
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-violet-50 via-fuchsia-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-slate-700">Chargement de l'événement...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-violet-50 via-fuchsia-50 to-slate-100">
        <Navbar />
        <div className="text-center">
          <p className="text-xl text-red-500">Événement non trouvé</p>
          <Link href="/" className="mt-4 inline-block text-violet-600 hover:underline">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className={isDark ? "min-h-screen bg-slate-950 text-slate-100" : "min-h-screen bg-linear-to-b from-violet-50 via-fuchsia-50 to-slate-100 text-slate-900"}>
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-8 pt-24">
        <section className={isDark ? "mb-10 rounded-4xl bg-slate-900/95 p-10 shadow-2xl" : "mb-10 rounded-4xl bg-white/80 p-10 shadow-2xl backdrop-blur-xl"}>
          <h1 className="text-5xl font-bold tracking-tight">
            {event.title}
            <span className="ml-3 text-sm font-mono text-violet-500">(ID: {event.id})</span>
          </h1>
          <p className={isDark ? "mt-4 max-w-2xl text-slate-300" : "mt-4 max-w-2xl text-slate-600"}>{event.description}</p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <span className={isDark ? "inline-flex items-center gap-2 rounded-2xl bg-slate-800/80 px-4 py-3 text-sm text-slate-200" : "inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700"}>
              📅 {formatDate(event.start_date, event.end_date)}
            </span>
            <span className={isDark ? "inline-flex items-center gap-2 rounded-2xl bg-slate-800/80 px-4 py-3 text-sm text-slate-200" : "inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700"}>
              📍 {event.place}
            </span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setView("planning")}
              className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              Voir le planning
            </button>
            <span className={isDark ? "inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-4 py-3 text-sm text-slate-200" : "inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-3 text-sm text-slate-700"}>
              Salle principale
            </span>
          </div>

          <div className="mt-10 flex gap-4">
            <button
              onClick={() => setView("sessions")}
              className={`px-6 py-3 rounded-3xl font-semibold transition ${
                view === "sessions"
                  ? "bg-violet-600 text-white"
                  : isDark ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-200 text-slate-900 hover:bg-slate-300"
              }`}
            >
              📋 Sessions
            </button>
            <button
              onClick={() => setView("planning")}
              className={`px-6 py-3 rounded-3xl font-semibold transition ${
                view === "planning"
                  ? "bg-violet-600 text-white"
                  : isDark ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-200 text-slate-900 hover:bg-slate-300"
              }`}
            >
              📅 Planning
            </button>
          </div>
        </section>

        {view === "sessions" && (
          <section className="max-w-6xl">
            {liveSessions.length > 0 && (
              <div className="mb-10 rounded-3xl border border-rose-500/20 bg-rose-500/5 p-6 shadow-2xl">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-rose-600/15 px-3 py-1 text-xs font-semibold text-rose-200">
                      LIVE
                    </span>
                    <h2 className="mt-3 text-2xl font-semibold">Sessions en cours ({liveSessions.length})</h2>
                  </div>
                  <p className={isDark ? "text-slate-300" : "text-slate-600"}>
                    {liveSessions.length} session{liveSessions.length > 1 ? "s" : ""} actuellement en direct.
                  </p>
                </div>
                <div className="grid gap-4">
                  {liveSessions.map((session) => (
                    <div key={session.id} className={isDark ? "rounded-3xl bg-slate-900 p-6 shadow-xl" : "rounded-3xl bg-white p-6 shadow-xl"}>
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-xl font-semibold">{session.title}</h3>
                          <p className={isDark ? "mt-2 text-slate-300" : "mt-2 text-slate-600"}>{session.description}</p>
                        </div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-red-500/15 px-3 py-2 text-sm font-semibold text-rose-200">
                          En direct • {formatTime(session.start_time, session.end_time)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6 flex flex-wrap items-center gap-4">
              <span className={isDark ? "rounded-full bg-rose-600/20 px-3 py-1 text-xs font-semibold text-rose-200" : "rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700"}>
                PROGRAMME
              </span>
              <h2 className="text-2xl font-semibold">Sessions ({event.sessions.length})</h2>
            </div>

            <div className="space-y-4">
              {event.sessions.map((session) => (
                <div key={session.id} className={isDark ? "overflow-hidden rounded-2xl bg-slate-800 p-6 shadow-xl" : "overflow-hidden rounded-2xl bg-white p-6 shadow-xl"}>
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{session.title}</h3>
                      <p className={isDark ? "mt-2 text-slate-300" : "mt-2 text-slate-600"}>{session.description}</p>
                    </div>
                  </div>

                  <div className={isDark ? "mt-4 flex flex-wrap gap-2 text-sm text-slate-300" : "mt-4 flex flex-wrap gap-2 text-sm text-slate-600"}>
                    <span className={isDark ? "rounded-lg bg-slate-700 px-3 py-1" : "rounded-lg bg-slate-100 px-3 py-1"}>
                      🕒 {formatTime(session.start_time, session.end_time)}
                    </span>
                    <span className={isDark ? "rounded-lg bg-slate-700 px-3 py-1" : "rounded-lg bg-slate-100 px-3 py-1"}>
                      📍 {session.room.name}
                    </span>
                    <span className={isDark ? "rounded-lg bg-slate-700 px-3 py-1" : "rounded-lg bg-slate-100 px-3 py-1"}>
                      👥 {session.room.capacity}
                    </span>
                  </div>

                  {session.speakers.length > 0 && (
                    <div className={isDark ? "mt-4 border-t border-slate-700 pt-4" : "mt-4 border-t border-slate-200 pt-4"}>
                      <p className={isDark ? "mb-2 text-sm text-slate-400" : "mb-2 text-sm text-slate-600"}>Intervenants:</p>
                      <div className="space-y-2">
                        {session.speakers.map((item) => (
                          <Link href={`/speakers/${item.speaker.id}`} key={item.id_speaker}>
                            <div className={isDark ? "flex items-center gap-3 rounded-lg bg-slate-700/50 p-3 cursor-pointer hover:bg-slate-700 transition" : "flex items-center gap-3 rounded-lg bg-slate-100 p-3 cursor-pointer hover:bg-slate-200 transition"}>
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-white text-sm font-bold">
                                {item.speaker.full_name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold">{item.speaker.full_name}</p>
                                <p className={isDark ? "text-xs text-slate-400" : "text-xs text-slate-500"}>{item.speaker.biography?.substring(0, 60)}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {view === "planning" && planning && planning.success && (
          <section className="max-w-6xl">
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <span className={isDark ? "rounded-full bg-blue-600/20 px-3 py-1 text-xs font-semibold text-blue-200" : "rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"}>
                PLANNING MULTI-PISTES
              </span>
              <h2 className="text-2xl font-semibold">Planning par salle</h2>
            </div>

            {planning.data.rooms.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedRoom(null)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    !selectedRoom
                      ? "bg-violet-600 text-white"
                      : isDark ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-200 text-slate-900 hover:bg-slate-300"
                  }`}
                >
                  🏢 Toutes les salles
                </button>

                {planning.data.rooms.map((room) => (
                  <button
                    key={room}
                    onClick={() => setSelectedRoom(room)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      selectedRoom === room
                        ? "bg-violet-600 text-white"
                        : isDark ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-200 text-slate-900 hover:bg-slate-300"
                    }`}
                  >
                    {room}
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-6">
              {planning.data.rooms.map((room) => (
                (!selectedRoom || selectedRoom === room) && (
                  <div key={room} className={isDark ? "rounded-2xl bg-slate-800/50 p-6" : "rounded-2xl bg-white p-6 shadow-xl"}>
                    <h3 className="mb-4 text-xl font-bold text-violet-600 flex items-center gap-2">
                      📍 {room}
                    </h3>
                    <div className="space-y-3">
                      {planning.data.planning[room]?.map((session) => (
                        <div
                          key={session.id}
                          className={`p-4 rounded-lg border-l-4 transition ${
                            session.isLive
                              ? isDark
                                ? "border-red-500 bg-red-500/10"
                                : "border-red-500 bg-red-50"
                              : isDark
                                ? "border-slate-600 bg-slate-700/30"
                                : "border-slate-300 bg-slate-50"
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                {session.isLive && (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500 text-white text-xs font-semibold">
                                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                                    LIVE
                                  </span>
                                )}
                                <h4 className="font-semibold text-lg">{session.title}</h4>
                              </div>
                              <p className={isDark ? "mt-1 text-sm text-slate-400" : "mt-1 text-sm text-slate-600"}>{session.description}</p>
                            </div>
                            <div className={isDark ? "text-right text-sm text-slate-300" : "text-right text-sm text-slate-600"}>
                              <div className="font-semibold">{session.timeSlot}</div>
                            </div>
                          </div>

                          {session.speakers && session.speakers.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {session.speakers.map((item) => (
                                <Link href={`/speakers/${item.speaker.id}`} key={item.id_speaker}>
                                  <span className={isDark ? "inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-600 text-slate-100 text-xs cursor-pointer hover:bg-slate-500 transition" : "inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-200 text-slate-800 text-xs cursor-pointer hover:bg-slate-300 transition"}>
                                    🎤 {item.speaker.full_name}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}