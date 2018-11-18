export function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    minutes = minutes % 60;

    if (hours) {
        if (minutes) {
            return `${hours}h ${minutes}min`;
        }
        return `${hours}h`;
    }
    return `${minutes}min`;
}
