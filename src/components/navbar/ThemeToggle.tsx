"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const currentTheme = resolvedTheme ?? theme ?? "light";

  return (
    <button
      type="button"
      onClick={() =>
        setTheme(currentTheme === "dark" ? "light" : "dark")
      }
      className="
        px-3 py-1 rounded-lg
        bg-gray-200 text-gray-900
        dark:bg-slate-800 dark:text-white
        transition-colors duration-200
      "
    >
      {currentTheme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}