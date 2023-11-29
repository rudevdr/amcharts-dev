import type { Timezone } from "./Timezone";
export declare type TimeUnit = "millisecond" | "second" | "minute" | "hour" | "day" | "week" | "month" | "year";
export interface ITimeInterval {
    timeUnit: TimeUnit;
    count: number;
}
/**
 * Returns a `Promise` which can be used to execute code after number of
 * milliseconds.
 *
 * @param   ms  Sleep duration in ms
 * @return      Promise
 */
export declare function sleep(ms: number): Promise<void>;
/**
 * Maps time period names to their numeric representations in milliseconds.
 *
 * @ignore Exclude from docs
 */
export declare let timeUnitDurations: {
    [Key in TimeUnit]: number;
};
/**
 * Returns the next time unit that goes after source `unit`.
 *
 * E.g. "hour" is the next unit after "minute", etc.
 *
 * @ignore Exclude from docs
 * @param unit  Source time unit
 * @return Next time unit
 */
export declare function getNextUnit(unit: TimeUnit): TimeUnit | undefined;
/**
 * Returns number of milliseconds in the `count` of time `unit`.
 *
 * Available units: "millisecond", "second", "minute", "hour", "day", "week",
 * "month", and "year".
 *
 * @param unit   Time unit
 * @param count  Number of units
 * @return Milliseconds
 */
export declare function getDuration(unit: TimeUnit, count?: number): number;
/**
 * @ignore
 */
export declare function getIntervalDuration(interval: ITimeInterval | undefined): number;
export declare function getDateIntervalDuration(interval: ITimeInterval, date: Date, firstDateOfWeek?: number, utc?: boolean, timezone?: Timezone): number;
/**
 * Returns current `Date` object.
 *
 * @return Current date
 */
export declare function now(): Date;
/**
 * Returns current timestamp.
 *
 * @return Current timestamp
 */
export declare function getTime(): number;
/**
 * Returns a copy of the `Date` object.
 *
 * @param date  Source date
 * @return Copy
 */
export declare function copy(date: Date): Date;
/**
 * Checks if the `unit` part of two `Date` objects do not match. Two dates
 * represent a "range" of time, rather the same time date.
 *
 * @param timeOne  timestamp
 * @param timeTwo  timestamp
 * @param unit     Time unit to check
 * @return Range?
 */
export declare function checkChange(timeOne: number, timeTwo: number, unit: TimeUnit, utc?: boolean, timezone?: Timezone): boolean;
/**
 * Adds `count` of time `unit` to the source date. Returns a modified `Date` object.
 *
 * @param date   Source date
 * @param unit   Time unit
 * @param count  Number of units to add
 * @return Modified date
 */
export declare function add(date: Date, unit: TimeUnit, count: number, utc?: boolean, timezone?: Timezone): Date;
/**
 * "Rounds" the date to specific time unit.
 *
 * @param date             Source date
 * @param unit             Time unit
 * @param count            Number of units to round to
 * @param firstDateOfWeek  First day of week
 * @param utc              Use UTC timezone
 * @param firstDate        First date to round to
 * @param roundMinutes     Minutes to round to (some timezones use non-whole hour)
 * @param timezone         Use specific named timezone when rounding
 * @return New date
 */
export declare function round(date: Date, unit: TimeUnit, count: number, firstDateOfWeek?: number, utc?: boolean, firstDate?: Date, timezone?: Timezone): Date;
/**
 * @ignore
 */
export declare function chooseInterval(index: number, duration: number, gridCount: number, intervals: Array<ITimeInterval>): ITimeInterval;
/**
 * @ignore
 */
export declare function getUnitValue(date: Date, unit: TimeUnit): number;
//# sourceMappingURL=Time.d.ts.map