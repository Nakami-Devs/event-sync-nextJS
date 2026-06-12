"use client"

import Link from "next/link"
import ThemeToggle from "./ThemeToggle"

const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:5173"

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex flex-col md:flex-row md:justify-between md:items-center px-6 py-4 border-b border-white/10 backdrop-blur-lg bg-white/5">
      <h1 className="text-lg font-bold flex items-center gap-2">
        ⚡ EventSync
      </h1>

      <div className="flex items-center gap-6">
        <Link href="/events/" className="hover:text-purple-400">Événements</Link>
        <Link href="/favorites" className="hover:text-purple-400">Favoris</Link>
        <Link href={ADMIN_URL} className="hover:text-purple-400">Admin</Link>

        <ThemeToggle />
      </div>
    </nav>
  )
}