export interface EventItem {
    id: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    place: string;
    sessions: Array<{ id: string }>;
}