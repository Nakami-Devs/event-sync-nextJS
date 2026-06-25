import { Session } from "@/types"

export function isSessionLive(start: string, end: string): boolean {
    const now = Date.now()
    return now >= new Date(start).getTime() && now <= new Date(end).getTime()
}

export function getSpeakerNames(speakers: Array<{ speaker: { full_name: string } }>): string {
    return speakers.map(s => s.speaker.full_name).join(', ')
}

function toDateKey(iso: string): string {
    return iso.slice(0, 10)
}

function formatDayLabel(dateKey: string): string {
    const date = new Date(dateKey)
    return date.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: "UTC"
    })
}

interface DayGroup {
    dateKey: string;
    label: string;
    rooms: RoomGroup[];
}

interface RoomGroup {
    roomId: string;
    roomName: string;
    sessions: Session[]
}

export function groupSessionsByDayAndRoom(sessions: Session[]): DayGroup[]{
    const map = new Map<string, Map<string, Session[]>>();

    for(const session of sessions){
        const dateKey = toDateKey(session.start_time)
        if(!map.has(dateKey)) map.set(dateKey, new Map())

        const roomMap = map.get(dateKey)!
        if(!roomMap.has(session.id_room)) roomMap.set(session.id_room, [])
        roomMap.get(session.id_room)!.push(session)
    }

    return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dateKey, roomMap]) => ({
        dateKey,
        label: formatDayLabel(dateKey),
        rooms: Array.from(roomMap.entries()).map(([roomId, sessions]) => ({
            roomId,
            roomName: sessions[0].room.name,
            sessions: sessions.sort(
                (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
            ),
        })),
    }))
}