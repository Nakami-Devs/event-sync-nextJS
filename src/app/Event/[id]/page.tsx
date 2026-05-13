"use client";

import Link from "next/link";
import { useState } from "react";

type Speaker = {
  name: string;
  role: string;
};

type EventData = {
  id: string;
  title: string;
  subtitle: string;
  dateLabel: string;
  locationLabel: string;
  primaryLabel: string;
  secondaryLabel: string;
  sessionTitle: string;
  sessionDescription: string;
  sessionTime: string;
  sessionPlace: string;
  sessionCapacity: string;
  speakers: Speaker[];
};

const EVENT_DATA: EventData = {
  id: "1",
  title: "Test Live",
  subtitle: "fdhrtydhhrtf",
  dateLabel: "4 mai 2026 — 5 mai 2026",
  locationLabel: "HEI Ivandry, Antananarivo",
  primaryLabel: "Voir le planning",
  secondaryLabel: "Rooftop",
  sessionTitle: "Live Test",
  sessionDescription: "dgdthyhtht",
  sessionTime: "09:00 — 20:00",
  sessionPlace: "Rooftop",
  sessionCapacity: "500 places",
  speakers: [
    { name: "Nelio Giovanni", role: "Speaker" },
    { name: "RANDRIANASOLO Finoana", role: "Speaker" },
    { name: "Fanamby Fitia", role: "Speaker" },
    { name: "Maherison Koloina", role: "Speaker" },
  ],
};

type PageProps = {
  params: { id: string };
};

export default function EventPage({ params }: PageProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const isDark = theme === "dark";
  const event = { ...EVENT_DATA, id: params.id };

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
              {isDark ? "Light" : "Dark"}
            </button>
          </nav>
        </header>

        <section className={isDark ? "mt-10 rounded-[2rem] bg-slate-900/95 p-10 shadow-2xl shadow-slate-950/40" : "mt-10 rounded-[2rem] bg-white/80 p-10 shadow-2xl backdrop-blur-xl"}>
          <h1 className="text-5xl font-bold tracking-tight">{event.title}</h1>
          <p className={isDark ? "mt-4 max-w-2xl text-slate-300" : "mt-4 max-w-2xl text-slate-600"}>{event.subtitle}</p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <span className={isDark ? "inline-flex items-center gap-2 rounded-2xl bg-slate-800/80 px-4 py-3 text-sm text-slate-200 shadow-sm" : "inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700 shadow-sm"}>
              📅 {event.dateLabel}
            </span>
            <span className={isDark ? "inline-flex items-center gap-2 rounded-2xl bg-slate-800/80 px-4 py-3 text-sm text-slate-200 shadow-sm" : "inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700 shadow-sm"}>
              📍 {event.locationLabel}
            </span>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <button className="rounded-3xl bg-violet-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-violet-700">
              {event.primaryLabel}
            </button>
            <button className={isDark ? "rounded-3xl border border-slate-700 bg-slate-900 px-8 py-4 text-base font-semibold text-slate-100 transition hover:bg-slate-800" : "rounded-3xl border border-slate-300 bg-white px-8 py-4 text-base font-semibold text-slate-800 transition hover:bg-slate-50"}>
              {event.secondaryLabel}
            </button>
          </div>
        </section>

        <section className="mt-12 max-w-4xl">
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <span className={isDark ? "rounded-full bg-rose-600/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-rose-200" : "rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-rose-700"}>
              LIVE
            </span>
            <h2 className="text-2xl font-semibold text-inherit">Sessions en cours (1)</h2>
          </div>

          <article className={isDark ? "overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-500 via-orange-400 to-orange-300 p-8 text-slate-950 shadow-2xl shadow-slate-950/40" : "overflow-hidden rounded-[2rem] bg-gradient-to-br from-amber-200 via-orange-200 to-amber-100 p-8 shadow-2xl"}>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className={isDark ? "text-3xl font-semibold text-slate-950" : "text-3xl font-semibold"}>{event.sessionTitle}</h3>
                <p className={isDark ? "mt-3 text-slate-900/70" : "mt-3 text-slate-700"}>{event.sessionDescription}</p>
              </div>
              <button className={isDark ? "self-start rounded-full bg-white/90 px-5 py-3 text-sm font-semibold text-rose-600 shadow-sm hover:bg-white" : "self-start rounded-full bg-white/90 px-5 py-3 text-sm font-semibold text-rose-600 shadow-sm hover:bg-white"}>
                ♥
              </button>
            </div>

            <div className={isDark ? "mt-8 flex flex-wrap gap-3 text-sm text-slate-950" : "mt-8 flex flex-wrap gap-3 text-sm text-slate-700"}>
              <span className="inline-flex items-center gap-2 rounded-2xl bg-white/80 px-4 py-3">{event.sessionTime}</span>
              <span className="inline-flex items-center gap-2 rounded-2xl bg-white/80 px-4 py-3">{event.sessionPlace}</span>
              <span className="inline-flex items-center gap-2 rounded-2xl bg-white/80 px-4 py-3">{event.sessionCapacity}</span>
            </div>

            <div className="mt-8 grid gap-4">
              {event.speakers.map((speaker) => (
                <div key={speaker.name} className={isDark ? "flex items-center gap-4 rounded-3xl bg-white/90 p-4 shadow-sm" : "flex items-center gap-4 rounded-3xl bg-white/90 p-4 shadow-sm"}>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white text-base font-bold">
                    {speaker.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{speaker.name}</p>
                    <p className={isDark ? "text-sm text-slate-700" : "text-sm text-slate-500"}>{speaker.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}