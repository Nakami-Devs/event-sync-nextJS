"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import Navbar from "@/components/navbar/Navbar";
import { MapPin, ExternalLink, ArrowLeft, Mic, Calendar, Clock } from "lucide-react";

type Speaker = {
  id: string;
  full_name: string;
  profile_pic: string;
  biography: string;
  external_links: string;
};

type Session = {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  room: {
    name: string;
    capacity: string;
  };
};

type SessionSpeaker = {
  id_speaker: string;
  id_session: string;
  session: Session & {
    event: {
      id: string;
      title: string;
      start_date: string;
      end_date: string;
    };
  };
};

type SpeakerData = Speaker & {
  sessions: SessionSpeaker[];
};

export default function SpeakerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [speaker, setSpeaker] = useState<SpeakerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpeaker = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/speakers/${id}`);
        if (!response.ok) throw new Error("Erreur lors du chargement du speaker");
        const data = await response.json();
        setSpeaker(data);
      } catch (error) {
        console.error("Erreur:", error);
        setSpeaker(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSpeaker();
  }, [id]);

  const handleDelete = async () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet intervenant ?")) {
      try {
        const response = await fetch(`/api/speakers/${id}`, { method: "DELETE" });
        if (response.ok) {
          alert("Intervenant supprimé avec succès");
          router.push("/speakers");
        } else {
          alert("Erreur lors de la suppression");
        }
      } catch (error) {
        console.error("Erreur:", error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--page-gradient)" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-[var(--foreground)]">Chargement de l'intervenant...</p>
        </div>
      </div>
    );
  }

  if (!speaker) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--page-gradient)" }}>
        <Navbar />
        <div className="text-center">
          <p className="text-xl text-red-500">Intervenant non trouvé</p>
          <Link href="/speakers" className="mt-4 inline-block text-violet-600 hover:underline">
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[var(--foreground)]" style={{ background: "var(--page-gradient)" }}>
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">
        <div className={isDark ? "bg-slate-900/95 rounded-2xl shadow-xl p-8" : "bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-8"}>
        
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-violet-500 to-fuchsia-500 p-1">
              <div className="w-full h-full rounded-full bg-white p-1">
                {speaker.profile_pic ? (
                  <img
                    src={speaker.profile_pic}
                    alt={speaker.full_name}
                    className="rounded-full object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center text-4xl font-bold text-violet-600">
                    {speaker.full_name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-[var(--foreground)]">{speaker.full_name}</h1>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-[var(--foreground)]">{speaker.full_name}</h1>

            {/* Badge sessions */}
            <div className="flex items-center gap-2 mt-3 justify-center md:justify-start flex-wrap">
              <span
                style={{ background: "var(--badge-violet-bg)", color: "var(--badge-violet-text)" }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
              >
                <Mic size={14} />
                {speaker.sessions.length} session{speaker.sessions.length > 1 ? "s" : ""}
              </span>
              {speaker.sessions.length > 0 && (
                <span
                  style={{ background: "var(--badge-blue-bg)", color: "var(--badge-blue-text)" }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
                >
                  <Calendar size={14} />
                  {new Set(speaker.sessions.map(s => s.session.event.id)).size} événement{new Set(speaker.sessions.map(s => s.session.event.id)).size > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          <div className={`mt-8 border-t pt-6 ${isDark ? "border-slate-700" : "border-slate-200"}`}>
            <h2 className="text-xl font-semibold mb-3">Biographie</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {speaker.biography || "Aucune biographie disponible."}
            </p>
          </div>

          {speaker.external_links && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Liens externes</h2>
              <div className="flex flex-wrap gap-3">
                {speaker.external_links.split(",").map((link, index) => (
                  <a
                    key={index}
                    href={link.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ background: "var(--link-bg)", color: "var(--link-text)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--link-hover-bg)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "var(--link-bg)")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium"
                  >
                    <ExternalLink size={14} />
                    {link.trim().replace(/^https?:\/\//, "").split("/")[0]}
                  </a>
                ))}
              </div>
            </div>
          )}


          {speaker.sessions.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-violet-500" />
                Événements & Sessions
              </h2>
              <div className="space-y-4">
                {Object.values(
                  speaker.sessions.reduce((acc, sessionSpeaker) => {
                    const eventId = sessionSpeaker.session.event.id;
                    if (!acc[eventId]) {
                      acc[eventId] = {
                        event: sessionSpeaker.session.event,
                        sessions: [],
                      };
                    }
                    acc[eventId].sessions.push(sessionSpeaker.session);
                    return acc;
                  }, {} as Record<string, { event: { id: string; title: string; start_date: string; end_date: string }, sessions: Session[] }>)
                ).map(({ event, sessions }) => (
                  <div key={event.id} className={`rounded-2xl overflow-hidden border ${isDark ? "border-slate-700" : "border-slate-200"}`}>

                    {/* Header événement */}
                    <Link href={`/events/${event.id}`}>
                      <div className={`flex items-center justify-between p-4 cursor-pointer transition ${isDark ? "bg-slate-800 hover:bg-slate-700" : "bg-violet-50 hover:bg-violet-100"}`}>
                        <div>
                          <h3 className="font-bold text-[var(--foreground)] flex items-center gap-2">
                            <Calendar size={16} className="text-violet-500" />
                            {event.title}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(event.start_date).toLocaleDateString('fr-FR')} — {new Date(event.end_date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-violet-200 dark:bg-violet-800 text-violet-700 dark:text-violet-300 font-medium">
                          {sessions.length} session{sessions.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    </Link>

                    {/* Liste des sessions */}
                    <div className={`divide-y ${isDark ? "divide-slate-700" : "divide-slate-100"}`}>
                      {sessions.map((session) => (
                        <div key={session.id} className={`px-4 py-3 ${isDark ? "bg-slate-900/50" : "bg-white/80"}`}>
                          <p className="font-medium text-sm text-[var(--foreground)]">{session.title}</p>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <Clock size={11} />
                              {new Date(session.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} — {new Date(session.end_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <MapPin size={11} className="text-blue-400" />
                              {session.room.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}