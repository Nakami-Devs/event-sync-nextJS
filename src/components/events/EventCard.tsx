import Link from "next/link";
import {Calendar, MapPin, Mic} from "lucide-react";

type Event = {
    id: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    place: string;
    sessions: Array<{ id: string }>;
}

export async function getEvents(): Promise<Event[]> {
    try {
        const res = await fetch('http://localhost:3000/api/events', {
            cache: 'no-store'
        })
        if (!res.ok) return []
        return res.json()
    } catch {
        return []
    }
}

export default async function EventCard() {
    const events = await getEvents();
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event: Event) => (
                <Link key={event.id} href={`/Event/${event.id}`}>
                    <div
                        className="flex flex-col gap-3 bg-white/5 border border-white/10 border-t-6 border-t-purple-800 border-t-linear-to-r
                        backdrop-blur-xl hover:scale-105 hover:border-violet-400 transition-all duration-300 cursor-pointer h-full rounded-2xl p-5">
                        <h1 className="text-2xl font-bold">{event.title}</h1>
                        <p>{event.description}</p>
                        <div className="flex items-center gap-1 text-[12px]">
                            <Calendar className="size-4 text-purple-400"/>
                            <p>{(new Date(event.start_date)).toDateString()} - {(new Date(event.end_date)).toDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2 text-[12px]">
                            <div className="flex items-center gap-1">
                                <MapPin className="size-4 text-blue-400"/>
                                <p>{event.place}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <Mic className="size-4 text-purple-400"/>
                                <p>{event.sessions.length} sessions</p>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}