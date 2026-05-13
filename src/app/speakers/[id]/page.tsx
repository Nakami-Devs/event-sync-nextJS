"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type SpeakerData = {
  id: string;
  full_name: string;
  profile_pic: string;
  biography: string;
  external_links: string;
  sessions: {
    id: string;
    title: string;
    event: {
      id: string;
      title: string;
    };
  }[];
};

export default function SpeakerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  
  const [speaker, setSpeaker] = useState<SpeakerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const isDark = theme === "dark";

  useEffect(() => {
    const fetchSpeaker = async () => {
      setLoading(true);
      try {
    const mockSpeakers: Record<string, SpeakerData> = {
          "sp1": {
            id: "sp1",
            full_name: "Nelio Giovanni",
            profile_pic: "/avatars/nelio.jpg",
            biography: "Expert en intelligence artificielle et transformation digitale. Passionné par l'innovation et les nouvelles technologies.",
            external_links: "https://linkedin.com/in/nelio,https://twitter.com/nelio",
            sessions: [
              { id: "sess1", title: "Live Test", event: { id: "1", title: "Test Live" } }
            ]
          },
          "sp2": {
            id: "sp2",
            full_name: "RANDRIANASOLO Finoana",
            profile_pic: "/avatars/finoana.jpg",
            biography: "Spécialiste en cybersécurité et protection des données. Conférencier international.",
            external_links: "https://linkedin.com/in/finoana",
            sessions: [
              { id: "sess1", title: "Live Test", event: { id: "1", title: "Test Live" } }
            ]
          },
          "sp3": {
            id: "sp3",
            full_name: "Fanamby Fitia",
            profile_pic: "/avatars/fanamby.jpg",
            biography: "Experte en marketing digital et community management. Formatrice certifiée.",
            external_links: "https://linkedin.com/in/fanamby",
            sessions: [
              { id: "sess1", title: "Live Test", event: { id: "1", title: "Test Live" } }
            ]
          },
          "sp4": {
            id: "sp4",
            full_name: "Maherison Koloina",
            profile_pic: "/avatars/koloina.jpg",
            biography: "Développeur full-stack et architecte logiciel. Mentor technique.",
            external_links: "https://github.com/koloina",
            sessions: [
              { id: "sess1", title: "Live Test", event: { id: "1", title: "Test Live" } }
            ]
          }
        };
        
        const found = mockSpeakers[id];
        setSpeaker(found || null);
      } catch (error) {
        console.error("Erreur lors du chargement du speaker:", error);
        setSpeaker(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSpeaker();
    }
  }, [id]);

  const handleDelete = async () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet intervenant ?")) {
      try {
        // Appel API pour supprimer : `/api/speakers/${id}`
        console.log("Suppression du speaker:", id);
        alert("Intervenant supprimé avec succès");
        router.push("/speakers"); // Redirection vers la liste des speakers
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-slate-950 text-white" : "bg-gradient-to-b from-violet-50 via-fuchsia-50 to-slate-100"}`}>
        Chargement...
      </div>
    );
  }

  if (!speaker) {
    return (
      <div className={`min-h-screen flex items-center justify-center text-red-500 ${isDark ? "bg-slate-950" : "bg-gradient-to-b from-violet-50 via-fuchsia-50 to-slate-100"}`}>
        <div className="text-center">
          <p className="text-xl">Intervenant non trouvé</p>
          <Link href="/speakers" className="mt-4 inline-block text-violet-600 hover:underline">
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-950 text-slate-100" : "bg-gradient-to-b from-violet-50 via-fuchsia-50 to-slate-100 text-slate-900"} p-8`}>
      <div className="max-w-4xl mx-auto">
        <Link href="/speakers" className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 mb-6">
          ← Retour à la liste
        </Link>
        
        <div className={`${isDark ? "bg-[#1a1a2e]" : "bg-white"} rounded-2xl shadow-xl p-8`}>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-violet-500 to-fuchsia-500 p-1">
              <div className="w-full h-full rounded-full bg-white p-1">
                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-violet-600">
                  {speaker.full_name.charAt(0)}
                </div>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold">{speaker.full_name}</h1>
              <p className={`${isDark ? "text-slate-400" : "text-slate-600"} mt-2`}>
                {speaker.sessions.length} session{speaker.sessions.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="mt-8 border-t pt-6 ${isDark ? 'border-slate-700' : 'border-slate-200'}">
            <h2 className="text-xl font-semibold mb-3">Biographie</h2>
            <p className={`${isDark ? "text-slate-300" : "text-slate-700"} leading-relaxed`}>
              {speaker.biography || "Aucune biographie disponible."}
            </p>
          </div>

          {speaker.external_links && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Liens externes</h2>
              <div className="flex flex-wrap gap-3">
                {speaker.external_links.split(',').map((link, index) => (
                  <a
                    key={index}
                    href={link.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-100 text-violet-700 hover:bg-violet-200 transition"
                  >
                    🔗 {link.trim().replace(/^https?:\/\//, '').split('/')[0]}
                  </a>
                ))}
              </div>
            </div>
          )}

          {speaker.sessions.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-3">Sessions</h2>
              <div className="space-y-3">
                {speaker.sessions.map((session) => (
                  <Link key={session.id} href={`/event/${session.event.id}`}>
                    <div className={`p-4 rounded-xl ${isDark ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-50 hover:bg-slate-100"} transition cursor-pointer`}>
                      <h3 className="font-semibold">{session.title}</h3>
                      <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {session.event.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <button 
              onClick={() => router.push(`/speaker/${speaker.id}/edit`)}
              className="px-6 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium transition"
            >
              Modifier
            </button>
            <button 
              onClick={handleDelete}
              className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}