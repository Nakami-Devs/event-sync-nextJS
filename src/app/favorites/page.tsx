import Navbar from "@/components/navbar/Navbar";
import EventCard from "@/components/events/EventCard";
import PageHeader from "@/components/PageHeader";
import { getFavorites } from "@/lib/api/favorites";

export default async function FavoritesPage(){
    const favorites = await getFavorites();
    const events = favorites.map(
        fav => fav.event
    );

    return (
        <main className="min-h-screen p-8">
            <Navbar/>
            <div className="max-w-6xl mx-auto mt-12">
                <PageHeader
                    title="Favoris"
                    count={events.length}
                    singular="événement"
                />
                <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {
                    events.map(event=>(
                        <EventCard
                            key={event.id}
                            event={event}
                        />
                    ))
                }
                </div>
            </div>
        </main>
    )
}