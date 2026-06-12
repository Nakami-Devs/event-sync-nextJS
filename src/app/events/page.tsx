import Navbar from "@/components/Navbar";
import EventCard from "@/components/events/EventCard";
import {getEvents} from "@/lib/api/events";
import PageHeader from "@/components/PageHeader";


export default async function EventPage() {
    const events = await getEvents();

    return (
        <main className="min-h-screen bg-linear-to-br from-[#0f172a] via-[#1e1b4b] to-[#020617] text-white p-8">
            <Navbar/>
            <div className="max-w-6xl mx-auto mt-12">
                <PageHeader title="Événements" count={events.length} singular="événement"/>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </div>
        </main>
    )
}