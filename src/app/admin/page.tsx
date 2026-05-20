import Link from 'next/link'

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Espace administrateur
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-foreground">
            Gestion des salles
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Cette interface vous permet de consulter les salles existantes, d’ajouter une nouvelle salle et de mettre à jour la capacité.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/admin/rooms"
              className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-accent"
            >
              Gérer les salles
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
