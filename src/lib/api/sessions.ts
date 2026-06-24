import { Session } from "@/types"

export async function getSessions(): Promise<Session[]> {
    try{
        const res = await fetch('http://localhost:3000/api/sessions', {
            cache: 'no-store'
        })
        if (!res.ok) return []
        return res.json()
    } catch {
        return []
    }
}