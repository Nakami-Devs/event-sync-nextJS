import { Room } from "@/types"

export async function getRooms(): Promise<Room[]> {
    try {
        const res = await fetch('http://localhost:3000/api/rooms', {
            cache: 'no-store'
        })
        if (!res.ok) return []
        return res.json()
    } catch {
        return []
    }
}