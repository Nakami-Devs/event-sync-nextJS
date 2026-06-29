"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const currentTheme = resolvedTheme ?? theme ?? "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="
        w-9 h-9 flex items-center justify-center rounded-md
        bg-purple-100/60 dark:bg-white/10
        border border-purple-200/50 dark:border-white/20
        dark:backdrop-blur-md
        hover:opacity-80 transition-all duration-200
      "
      style={{ color: currentTheme === "dark" ? "#facc15" : "#1a1a2e" }}
    >
      {currentTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}