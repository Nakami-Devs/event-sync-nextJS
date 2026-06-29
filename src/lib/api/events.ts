import {EventItem} from "@/types";

export async function getEvents(): Promise<EventItem[]> {
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