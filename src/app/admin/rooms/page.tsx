'use client'

import { FormEvent, useEffect, useState } from 'react'

type Room = {
  id: string
  name: string
  capacity: string
}

type FormState = {
  name: string
  capacity: string
}

const initialFormState: FormState = {
  name: '',
  capacity: '',
}

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [formState, setFormState] = useState<FormState>(initialFormState)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    void loadRooms()
  }, [])

  const loadRooms = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/rooms', { cache: 'no-store' })
      if (!response.ok) {
        throw new Error('Impossible de récupérer les salles')
      }
      const data = (await response.json()) as Room[]
      setRooms(data)
    } catch (err) {
      setError((err as Error).message || 'Erreur serveur')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEditingRoom(null)
    setFormState(initialFormState)
    setError('')
    setFeedback('')
  }

  const handleChange = (field: keyof FormState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }))
  }

  const handleEdit = (room: Room) => {
    setEditingRoom(room)
    setFormState({ name: room.name, capacity: room.capacity })
    setFeedback('')
    setError('')
  }

  const handleDelete = async (room: Room) => {
    if (!window.confirm(`Supprimer la salle « ${room.name} » ?`)) {
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const response = await fetch(`/api/rooms/${room.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression')
      }
      setRooms((current) => current.filter((item) => item.id !== room.id))
      setFeedback('Salle supprimée avec succès')
      resetForm()
    } catch (err) {
      setError((err as Error).message || 'Erreur serveur')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    const { name, capacity } = formState

    if (!name.trim() || !capacity.trim()) {
      setError('Le nom et la capacité sont obligatoires.')
      setSubmitting(false)
      return
    }

    try {
      const payload = { name: name.trim(), capacity: capacity.trim() }
      const response = await fetch(editingRoom ? `/api/rooms/${editingRoom.id}` : '/api/rooms', {
        method: editingRoom ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const result = await response.json().catch(() => null)
        throw new Error(result?.message ?? 'Erreur lors de l’enregistrement')
      }

      const savedRoom = (await response.json()) as Room
      setRooms((current) => {
        if (editingRoom) {
          return current.map((room) => (room.id === savedRoom.id ? savedRoom : room))
        }
        return [savedRoom, ...current]
      })
      setFeedback(editingRoom ? 'Salle mise à jour' : 'Salle créée')
      resetForm()
    } catch (err) {
      setError((err as Error).message || 'Erreur serveur')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="space-y-6">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Administration
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-foreground">Gestion des salles</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Liste des salles existantes et formulaire simple pour ajouter ou modifier le nom et la capacité.
              </p>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-2xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              Nouvelle salle
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-[1.5fr_1fr]">
            <div className="space-y-4 rounded-3xl border border-border bg-background p-6">
              <div>
                <label htmlFor="room-name" className="block text-sm font-medium text-foreground">
                  Nom de la salle
                </label>
                <input
                  id="room-name"
                  value={formState.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  placeholder="Ex. Grande Salle A"
                  className="mt-2 w-full rounded-2xl border border-border bg-transparent px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label htmlFor="room-capacity" className="block text-sm font-medium text-foreground">
                  Capacité
                </label>
                <input
                  id="room-capacity"
                  value={formState.capacity}
                  onChange={(event) => handleChange('capacity', event.target.value)}
                  placeholder="Ex. 200"
                  inputMode="numeric"
                  className="mt-2 w-full rounded-2xl border border-border bg-transparent px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex flex-col gap-3 pt-2 border-t border-border sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  {feedback && <p className="text-sm text-foreground/80">{feedback}</p>}
                </div>
                <div className="flex flex-wrap gap-3">
                  {editingRoom && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
                    >
                      Annuler
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {editingRoom ? 'Mettre à jour' : 'Créer la salle'}
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-background p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Résumé</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                {editingRoom
                  ? 'Vous modifiez une salle existante. Le changement s’appliquera immédiatement après validation.'
                  : 'Remplissez le formulaire pour ajouter une nouvelle salle au système.'}
              </p>
            </div>
          </form>
        </div>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Salles</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {rooms.length} salle{rooms.length > 1 ? 's' : ''} répertoriée{rooms.length > 1 ? 's' : ''}.
              </p>
            </div>
            <div className="rounded-2xl bg-muted px-3 py-2 text-sm text-muted-foreground">
              {loading ? 'Chargement…' : 'Données synchronisées avec le back-end'}
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-border">
            <table className="min-w-full divide-y divide-border text-left text-sm">
              <thead className="bg-background text-xs uppercase tracking-[0.16em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-4">Nom</th>
                  <th className="px-4 py-4">Capacité</th>
                  <th className="px-4 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-4 text-foreground">{room.name}</td>
                    <td className="px-4 py-4 text-muted-foreground">{room.capacity}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(room)}
                          className="rounded-2xl border border-border bg-background px-3 py-2 text-sm text-foreground transition hover:bg-muted"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(room)}
                          className="rounded-2xl border border-destructive bg-destructive/5 px-3 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && rooms.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      Aucune salle enregistrée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}
