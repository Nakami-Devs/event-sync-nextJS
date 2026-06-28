"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { Calendar, Heart, Settings } from "lucide-react";

const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:5173";

export default function Navbar() {
  return (
    <nav className="
      fixed top-0 left-0 w-full z-50
      flex flex-col md:flex-row
      md:justify-between md:items-center
      px-6 py-4
      border-b
      backdrop-blur-lg
      bg-[var(--navbar-bg)] dark:bg-white/5
      border-[var(--navbar-border)] dark:border-white/10
      transition-colors duration-300
    ">
      <Link
        href="/"
        className="text-lg font-bold flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
      >
        <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-400 
          flex items-center justify-center text-white text-sm">
          ⚡
        </span>
        <span style={{ color: 'var(--brand-text)' }}>
          EventSync
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <Link href="/events"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-sm
    bg-purple-100/60 dark:bg-transparent
    border border-purple-200/50 dark:border-transparent
    dark:text-gray-200 dark:hover:text-indigo-400 transition-all"
          style={{ color: 'var(--nav-text)' }}
        >
          <Calendar size={15} />
          Événements
        </Link>

        <Link href="/favorites"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-sm
    dark:text-gray-200 dark:hover:text-indigo-400 transition-all"
          style={{ color: 'var(--nav-text)' }}
        >
          <Heart size={15} />
          Favoris
        </Link>

        <Link href={ADMIN_URL}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-sm
    dark:text-gray-200 dark:hover:text-indigo-400 transition-all"
          style={{ color: 'var(--nav-text)' }}
        >
          <Settings size={15} />
          Admin
        </Link>

        <ThemeToggle />
      </div>
    </nav>
  );
}