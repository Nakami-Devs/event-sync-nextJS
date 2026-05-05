"use client"

import ThemeToggle from "./ThemeToggle"

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 border-b border-white/10 backdrop-blur-lg bg-white/5">
      <h1 className="text-lg font-bold flex items-center gap-2">
        ⚡ EventSync
      </h1>

      <div className="flex items-center gap-6">
        <a href="#" className="hover:text-purple-400">Événements</a>
        <a href="#" className="hover:text-purple-400">Favoris</a>
        <a href="#" className="hover:text-purple-400">Admin</a>

        <ThemeToggle />
      </div>
    </nav>
  )
}