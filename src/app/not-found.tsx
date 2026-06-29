import Link from "next/link"
import { Zap, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">

      
      <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 mb-8 shadow-lg shadow-violet-500/30">
        <Zap className="text-white" size={36} />
      </div>

      
      <h1 className="text-7xl sm:text-8xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
        404
      </h1>

      <h2 className="text-2xl sm:text-3xl font-semibold mb-3" style={{ color: "var(--foreground)" }}>
        Page introuvable
      </h2>

      <p className="max-w-md mb-10" style={{ color: "var(--nav-text)" }}>
        Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium hover:scale-105 transition-all duration-300 shadow-lg shadow-violet-500/30"
      >
        <Home size={18} />
        Retour à l&apos;accueil
      </Link>
    </div>
  )
}