'use client'

import { useState } from 'react'

type Question = {
  id:                string
  content:           string
  name:              string
  upvote_numbers:    number
  creation_datetime: string
}

type Props = {
  sessionId:        string
  initialQuestions: Question[]
}


function relativeTime(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1)  return "À l'instant"
  if (minutes < 60) return `Il y a ${minutes}min`
  const hours = Math.floor(minutes / 60)
  return `Il y a ${hours}h`
}

export default function QuestionSection({ sessionId, initialQuestions }: Props) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  const [content,   setContent]   = useState('')
  const [name,      setName]      = useState('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')


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
        setError(data.error || "Erreur lors de l'envoi.")
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

     
      <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-5">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        Questions ({questions.length})
      </h2>

      
      <div className="mb-6">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Posez votre question..."
          rows={3}
          className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 mb-3"
        />

        
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Votre nom (optionnel)"
            className="flex-1 bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            {loading ? 'Envoi...' : 'Envoyer'}
          </button>
        </div>

       
        {error && (
          <p className="text-red-400 text-sm mt-2">{error}</p>
        )}
      </div>

      
      {questions.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-6">
          Aucune question pour l&apos;instant. Soyez le premier !
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {questions.map(question => (
            <div
              key={question.id}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-4"
            >
              <div className="flex items-start gap-4">

               
                <button
                  onClick={() => handleUpvote(question.id)}
                  className="flex flex-col items-center text-gray-400 hover:text-violet-400 transition-colors min-w-[36px]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span className="text-sm font-bold mt-0.5">
                    {question.upvote_numbers}
                  </span>
                </button>

               
                <div className="flex-1">
                  <p className="text-white text-sm font-medium mb-2">
                    {question.content}
                  </p>

                 
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1 bg-white/10 rounded-full px-2 py-0.5">
                      👤 {question.name}
                    </span>
                    <span>•</span>
                    <span>{relativeTime(question.creation_datetime)}</span>
                  </div>
                </div>

               
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  0 réponse
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}