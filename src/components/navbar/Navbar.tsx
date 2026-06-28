"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import {
  Calendar,
  Heart,
  Settings,
  Menu,
  X,
} from "lucide-react";

const ADMIN_URL =
  process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:5173";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav
      className="
        fixed top-0 left-0 w-full z-50
        border-b
        backdrop-blur-lg
        bg-[var(--navbar-bg)] dark:bg-white/5
        border-[var(--navbar-border)] dark:border-white/10
        transition-colors duration-300
      "
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition"
        >
          <span
            className="
              flex h-8 w-8 items-center justify-center
              rounded-lg
              bg-gradient-to-br
              from-purple-500
              to-blue-400
              text-white
              text-sm
            "
          >
            ⚡
          </span>

          <span style={{ color: "var(--brand-text)" }}>
            EventSync
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/events"
            className="
              flex items-center gap-2
              rounded-lg
              px-3 py-2
              text-sm font-medium
              transition-all
              bg-purple-100/60
              border border-purple-200/50
              hover:bg-purple-200/60
              dark:bg-transparent
              dark:border-transparent
              dark:hover:bg-white/10
            "
            style={{ color: "var(--nav-text)" }}
          >
            <Calendar size={16} />
            Événements
          </Link>

          <Link
            href="/favorites"
            className="
              flex items-center gap-2
              rounded-lg
              px-3 py-2
              text-sm font-medium
              transition-all
              hover:bg-purple-100/60
              dark:hover:bg-white/10
            "
            style={{ color: "var(--nav-text)" }}
          >
            <Heart size={16} />
            Favoris
          </Link>

          <Link
            href={ADMIN_URL}
            className="
              flex items-center gap-2
              rounded-lg
              px-3 py-2
              text-sm font-medium
              transition-all
              hover:bg-purple-100/60
              dark:hover:bg-white/10
            "
            style={{ color: "var(--nav-text)" }}
          >
            <Settings size={16} />
            Admin
          </Link>

          <ThemeToggle />
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="
            md:hidden
            rounded-lg
            p-2
            transition
            hover:bg-purple-100
            dark:hover:bg-white/10
          "
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          md:hidden
          overflow-hidden
          transition-all
          duration-300
          ${menuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0"
          }
        `}
      >
        <div
          className="
            border-t
            border-[var(--navbar-border)]
            bg-white
            dark:bg-neutral-900/95
            backdrop-blur-lg
            px-4
            py-4
            space-y-2
          "
        >
          <Link
            href="/events"
            onClick={closeMenu}
            className="
              flex items-center gap-3
              rounded-lg
              px-3 py-3
              transition
              text-gray-900
              dark:text-white
              hover:bg-purple-100
              dark:hover:bg-white/10
            "
          >
            <Calendar size={18} />
            Événements
          </Link>

          <Link
            href="/favorites"
            onClick={closeMenu}
            className="
              flex items-center gap-3
              rounded-lg
              px-3 py-3
              transition
              hover:bg-purple-100
              dark:hover:bg-white/10
            "
            style={{ color: "var(--nav-text)" }}
          >
            <Heart size={18} />
            Favoris
          </Link>

          <Link
            href={ADMIN_URL}
            onClick={closeMenu}
            className="
              flex items-center gap-3
              rounded-lg
              px-3 py-3
              transition
              hover:bg-purple-100
              dark:hover:bg-white/10
            "
            style={{ color: "var(--nav-text)" }}
          >
            <Settings size={18} />
            Admin
          </Link>

          <div className="pt-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}