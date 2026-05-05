'use client' 

import { useState } from 'react'

type Question = {
  id:             string
  content:        string
  name:           string
  upvote_numbers: number
}

type Props = {
  sessionId:        string
  initialQuestions: Question[]
}

export default function QuestionSection({ sessionId, initialQuestions }: Props) {

  const [questions, setQuestions] = useState<Question[]>(initialQuestions)

  const [content, setContent] = useState('')
  const [name,    setName]    = useState('')

  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  async function handleSubmit() {
    if (!content.trim()) {
      setError('La question ne peut pas être vide.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/questions', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          content,
          name:       name.trim() || 'ANONYM',
          id_session: sessionId
        })
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Erreur lors de l\'envoi.')
        return
      }

      const newQuestion: Question = await res.json()

      
      setQuestions(prev => [newQuestion, ...prev])

      
      setContent('')
      setName('')

    } catch {
      setError('Erreur réseau.')
    } finally {
      setLoading(false)
    }
  }

 
  async function handleUpvote(questionId: string) {
    try {
      const res = await fetch(`/api/questions/${questionId}/upvote`, {
        method: 'PATCH'
      })

      if (!res.ok) return

      const updated: Question = await res.json()

      
      setQuestions(prev =>
        prev
          .map(q => q.id === questionId ? updated : q)
          .sort((a, b) => b.upvote_numbers - a.upvote_numbers)
      )
    } catch {
      console.error('Erreur upvote')
    }
  }

 
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        ❓ Questions
      </h2>

      
      <div className="flex flex-col gap-3 mb-6">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Posez votre question..."
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Votre nom (optionnel)"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

       
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="self-end bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Envoi...' : 'Envoyer'}
        </button>
      </div>

      
      {questions.length === 0 ? (
        <p className="text-gray-400 text-sm">
         Aucune question pour l&apos;instant. Soyez le premier !
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {questions.map(question => (
            <div
              key={question.id}
              className="flex items-start gap-4 border border-gray-100 rounded-lg px-4 py-3"
            >
             
              <button
                onClick={() => handleUpvote(question.id)}
                className="flex flex-col items-center text-gray-400 hover:text-blue-600 transition-colors min-w-[36px]"
              >
                <span className="text-lg">▲</span>
                <span className="text-sm font-semibold">
                  {question.upvote_numbers}
                </span>
              </button>

             
              <div>
                <p className="text-gray-800 text-sm">{question.content}</p>
                <p className="text-gray-400 text-xs mt-1">
                  — {question.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
