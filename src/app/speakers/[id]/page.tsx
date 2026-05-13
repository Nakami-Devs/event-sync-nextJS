'use client';

import { useState, useEffect } from 'react';

interface Speaker {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

interface Session {
  id: string;
  title: string;
  status: 'live' | 'upcoming' | 'completed';
}

export default function SpeakerPage({ params }: { params: { id: string } }) {
  const [speaker, setSpeaker] = useState<Speaker | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  useEffect(() => {
    const fetchSpeakerData = async () => {
      const mockSpeaker: Speaker = {
        id: params.id,
        name: 'Sarah Anderson',
        role: 'Conférencière principale & Tech Evangelist',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Anderson&background=6366f1&color=fff&size=128',
        bio: 'Experte en développement web et technologies émergentes avec plus de 10 ans d\'expérience.'
      };

      const mockSessions: Session[] = [
        { id: '1', title: 'Live Test', status: 'live' },
        { id: '2', title: 'Test de la journée', status: 'completed' },
        { id: '3', title: 'Test de la nuit', status: 'upcoming' },
        { id: '4', title: 'Test de la semaine', status: 'upcoming' },
        { id: '5', title: 'Test de l\'année', status: 'upcoming' }
      ];

      setSpeaker(mockSpeaker);
      setSessions(mockSessions);
    };

    fetchSpeakerData();
  }, [params.id]);

  if (!speaker) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'live': return 'bg-red-500 animate-pulse';
      case 'upcoming': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'live': return 'LIVE';
      case 'upcoming': return 'À venir';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  const filteredSessions = selectedFilter === 'all' 
    ? sessions 
    : sessions.filter(s => s.status === selectedFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold mb-2">EventSync</h1>
          <p className="text-xl opacity-90">Espace Speaker</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 transform hover:scale-[1.01] transition-transform">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img 
                src={speaker.avatar} 
                alt={speaker.name}
                className="w-32 h-32 rounded-full border-4 border-indigo-500 shadow-lg"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{speaker.name}</h2>
              <p className="text-indigo-600 font-medium mb-3">{speaker.role}</p>
              <p className="text-gray-600 max-w-2xl">{speaker.bio}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-xl font-bold text-gray-800">
                Mes sessions
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({filteredSessions.length} sessions)
                </span>
              </h3>
              
              <div className="flex gap-2">
                {['all', 'live', 'upcoming', 'completed'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
                      selectedFilter === filter
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {filter === 'all' ? 'Tous' : filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredSessions.map((session, idx) => (
              <div 
                key={session.id}
                className="p-6 hover:bg-gray-50 transition-colors group cursor-pointer"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(session.status)}`} />
                    <div>
                      <h4 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                        {session.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Session #{idx + 1}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      session.status === 'live' 
                        ? 'bg-red-100 text-red-700' 
                        : session.status === 'upcoming'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {getStatusText(session.status)}
                    </span>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSessions.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p>Aucune session trouvée</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">✅</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {sessions.filter(s => s.status === 'completed').length}
                </p>
                <p className="text-sm text-gray-500">Sessions terminées</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600">⏰</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {sessions.filter(s => s.status === 'upcoming').length}
                </p>
                <p className="text-sm text-gray-500">À venir</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600">🔴</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {sessions.filter(s => s.status === 'live').length}
                </p>
                <p className="text-sm text-gray-500">En direct</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}