import { Session } from "@/types"

export async function getSessions(eventId: string): Promise<Session[]> {
    try{
        const res = await fetch(`http://localhost:3000/api/sessions?eventId=${eventId}`, {
            cache: 'no-store'
        })
        if (!res.ok) return []
        return res.json()
    } catch {
        return []
    }
}