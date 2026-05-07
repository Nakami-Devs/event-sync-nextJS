"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    if (!mounted) return null
    return (
        <button
            onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
            }
            className="px-3 py-1 rounded-lg bg-white/10"
        >
            {theme === "dark" ? "🌙" : "☀️"}
        </button>
    )
}