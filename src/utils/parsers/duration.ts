import {TimeTrackingConfig} from "../../types/timeTrackingConfig";

export class DurationParser {
    public constructor(private configuration: TimeTrackingConfig) {
    }

    public parseDuration(duration: string): number {
        if (!duration) {
            return 0;
        }

        let totalMinutes = 0;

        const minutes = this.parseDurationWithRegex(duration, /([0-9\,\.]+)m(in)?/i);
        if (minutes) {
            totalMinutes += minutes;
        }
        const hours = this.parseDurationWithRegex(duration, /([0-9\,\.]+)h(ours)?/i);
        if (hours) {
            totalMinutes += hours * 60;
        }

        const days = this.parseDurationWithRegex(duration, /([0-9\,\.]+)d(ays)?/i);
        if (days) {
            totalMinutes += days * this.configuration.hoursADay * 60;
        }

        const weeks = this.parseDurationWithRegex(duration, /([0-9\,\.]+)w(eeks)?/i);
        if (weeks) {
            totalMinutes += weeks * this.configuration.daysAWeek * this.configuration.hoursADay * 60;
        }

        return totalMinutes;
    }

    private parseDurationWithRegex(duration: string, regex: RegExp): number | null {
        let match = duration.match(regex);
        if (match && match.length > 0) {
            const extractedNumber: string = match[1].replace(",", ".");
            return parseFloat(extractedNumber);
        }
        return null;
    }
}