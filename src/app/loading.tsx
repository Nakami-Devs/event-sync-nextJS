export default function Loading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
      <div className="w-14 h-14 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin" />
      <p className="text-sm font-medium" style={{ color: "var(--nav-text)" }}>
        Chargement
      </p>
    </div>
  )
}
