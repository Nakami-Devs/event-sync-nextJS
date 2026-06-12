import Navbar from "@/components/Navbar";
import EventCard, { getEvents } from "@/components/events/EventCard";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";

export default async function EventPage() {
    const events = await getEvents();

    return (
        <main className="min-h-screen bg-linear-to-br from-[#0f172a] via-[#1e1b4b] to-[#020617] text-white p-8">
            <Navbar/>
            <div className="max-w-6xl mx-auto mt-12">
                <div className="flex items-center gap-3 mb-2">
                    <Link
                        href="/"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 border border-white/10"
                        title="Retour à l'accueil"
                    >
                        <ArrowLeft size={20} className="text-white"/>
                    </Link>
                    <h1 className="text-4xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        Événements
                    </h1>
                </div>
                <p className="text-gray-400 mb-10">
                    {events.length} événement{events.length > 1 ? 's' : ''} au total
                </p>
                <EventCard/>
            </div>
        </main>
    )
}