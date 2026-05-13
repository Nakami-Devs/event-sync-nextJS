"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

type Speaker = {
  id: string;
  name: string;
  avatar: string;
  sessions: number;
  bio?: string;
};

export default function SpeakerDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [speaker, setSpeaker] = useState<Speaker | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data: Speaker[] = [
      {
        id: "1",
        name: "Ahmed Benali",
        avatar: "/avatars/ahmed.jpg",
        sessions: 5,
        bio: "Expert en IA et transformation digitale.",
      },
      {
        id: "2",
        name: "Bill Gates",
        avatar: "/avatars/bill.jpg",
        sessions: 1,
        bio: "Entrepreneur et philanthrope.",
      },
      {
        id: "3",
        name: "Clara Rousseau",
        avatar: "/avatars/clara.jpg",
        sessions: 9,
        bio: "Spécialiste en cybersécurité.",
      },
    ];

    const found = data.find((s) => s.id === id);

    setSpeaker(found || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Chargement...
      </div>
    );
  }

  if (!speaker) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Intervenant introuvable
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-8">
      <div className="max-w-3xl mx-auto bg-[#1a1a2e] p-6 rounded-2xl shadow-lg">

        <div className="flex items-center gap-4">
          <Image
            src={speaker.avatar}
            alt={speaker.name}
            width={80}
            height={80}
            className="rounded-full object-cover"
          />

          <div>
            <h1 className="text-2xl font-bold">{speaker.name}</h1>
            <p className="text-gray-400">
              {speaker.sessions} sessions
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Bio</h2>
          <p className="text-gray-300">
            {speaker.bio || "Aucune bio disponible."}
          </p>
        </div>

        <div className="mt-8 flex gap-3">
          <button className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700">
            Modifier
          </button>

          <button className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700">
            Supprimer
          </button>
        </div>

      </div>
    </div>
  );
}