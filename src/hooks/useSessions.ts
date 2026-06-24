import { getSessions } from "@/lib/api/sessions";
import { Session } from "@/types";
import { useState, useEffect } from "react";

const POLL_INTERVAL = 30_000;

export function useSessions() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true

        async function fetchSessions() {
            const data = await getSessions();
            if (isMounted) {
                setSessions(data);
                setLoading(false);
            }
        }

        fetchSessions();
        const interval = setInterval(fetchSessions, POLL_INTERVAL);

        return () => {
            isMounted = false;
            clearInterval(interval);
        }
    }, [])
}
