import Link from "next/link";
import {Calendar, MapPin, Mic} from "lucide-react";
import {EventItem} from "@/types";

interface EventCardProps {
    event: EventItem;
}

export default async function EventCard({event}: EventCardProps) {
    return (
        <Link href={`/Event/${event.id}`}>
            <div className="flex flex-col gap-3 bg-[var(--card-bg)] border border-[var(--card-border)] border-t-6 border-t-purple-800 
            border-t-linear-to-r backdrop-blur-xl hover:scale-105 hover:border-violet-400 transition-all duration-300 cursor-pointer h-full rounded-2xl p-5">
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

    )
}