'use client';

import { useState, useEffect } from 'react';

interface Participant {
  name: string;
}

interface Session {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  participants: Participant[];
}

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  activeSessions: number;
  currentSession: Session;
}

export default function EventPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<'planning' | 'rooftop'>('planning');

  useEffect(() => {
    const fetchEvent = async () => {
      const mockEvent: Event = {
        id: params.id,
        title: 'Test Live',
        description: 'fdhrtydhhrtf',
        startDate: '2026-05-04',
        endDate: '2026-05-05',
        location: 'HEI Ivandry, Antananarivo',
        activeSessions: 1,
        currentSession: {
          id: '1',
          title: 'Live Test',
          description: 'dgtdhyththt',
          startTime: '09:00',
          endTime: '20:00',
          location: 'Rooftop',
          capacity: 500,
          participants: [
            { name: 'Nello Giovanni' },
            { name: 'RANDRIANASOLO Finoana' },
            { name: 'Fanamby Fitia' },
            { name: 'Maherison Kololina' }
          ]
        }
      };
      setEvent(mockEvent);
    };

    fetchEvent();
  }, [params.id]);

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-5xl font-bold mb-2">EventSync</h1>
          <p className="text-xl opacity-90">Gérez vos événements en temps réel</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{event.title}</h2>
          <p className="text-gray-500 mb-4">{event.description}</p>
          
          <div className="flex flex-wrap gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-xl">📅</span>
              <span>{formatDate(event.startDate)} — {formatDate(event.endDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📍</span>
              <span>{event.location}</span>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button 
              onClick={() => setViewMode('planning')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'planning' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Voir le planning
            </button>
            <button 
              onClick={() => setViewMode('rooftop')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'rooftop' 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rooftop
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h3 className="text-xl font-semibold text-gray-800">
              Sessions en cours ({event.activeSessions})
            </h3>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3">
              <span className="text-white font-semibold">LIVE</span>
            </div>
            
            <div className="p-6">
              <h4 className="text-2xl font-bold text-gray-800 mb-2">
                {event.currentSession.title}
              </h4>
              <p className="text-gray-500 mb-4">{event.currentSession.description}</p>
              
              <div className="flex flex-wrap gap-6 mb-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <span>⏰</span>
                  <span>{event.currentSession.startTime} — {event.currentSession.endTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>{event.currentSession.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>👥</span>
                  <span>{event.currentSession.participants.length} / {event.currentSession.capacity} places</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h5 className="font-semibold text-gray-700 mb-3">
                  Participants ({event.currentSession.participants.length})
                </h5>
                <div className="flex flex-wrap gap-2">
                  {event.currentSession.participants.map((participant, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1.5 bg-gray-100 rounded-lg text-gray-700 text-sm"
                    >
                      {participant.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {viewMode === 'rooftop' && (
          <div className="bg-white rounded-xl p-6 shadow-lg mt-6">
            <h4 className="font-semibold text-gray-800 mb-3">Progression de la session</h4>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '65%' }} />
            </div>
            <p className="text-sm text-gray-500 mt-2">65% de la session complétée</p>
          </div>
        )}
      </div>
    </div>
  );
}