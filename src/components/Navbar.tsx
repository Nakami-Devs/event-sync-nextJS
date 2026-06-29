"use client"

import Link from "next/link"
import ThemeToggle from "./ThemeToggle"
import Image from "next/image"

const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:5173"

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex flex-col md:flex-row md:justify-between md:items-center px-6 py-4 border-b border-white/10 backdrop-blur-lg bg-white/5">
      <h1 className="text-lg font-bold flex items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-white p-[3px] shadow-lg">
              <Image
              src="/EventSync_logo.png"
              alt="EventSync Logo"
              width={56}
              height={56} 
              className="w-full h-full rounded-full object-cover"
              priority
              />
            </div>

        <span className="font-bold text-lg">EventSync</span>
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