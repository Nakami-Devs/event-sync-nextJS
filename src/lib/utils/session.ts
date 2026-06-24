export function isSessionLive(start: string, end: string): boolean {
    const now = Date.now()
    return now >= new Date(start).getTime() && now <= new Date(end).getTime()
}

export function getSpeakerNames(speakers: Array<{ speaker: { full_name: string } }>): string {
    return speakers.map(s => s.speaker.full_name).join(', ')
}