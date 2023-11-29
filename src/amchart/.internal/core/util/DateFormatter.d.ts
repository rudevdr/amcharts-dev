import type { ILocaleSettings } from "./Language";
import { Entity, IEntitySettings, IEntityPrivate } from "./Entity";
/**
 * Interface describing parsed date format definition.
 *
 * @ignore
 */
export interface DateFormatInfo {
    "template": string;
    "parts": any[];
}
export interface IDateFormatterSettings extends IEntitySettings {
    /**
     * Should the first letter of the formatted date be capitalized?
     *
     * @default true
     */
    capitalize?: boolean;
    /**
     * A date format to be used when formatting dates.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/formatters/formatting-dates/} for more info
     */
    dateFormat?: string | Intl.DateTimeFormatOptions;
    /**
     * An array of data fields that hold date values and should be formatted
     * with a [[DateFormatter]].
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/formatters/data-placeholders/#Formatting_placeholders} for more info
     */
    dateFields?: string[];
    /**
     * Locales to use when formatting using `Intl.DateFormatter`.
     */
    intlLocales?: string;
}
export interface IDateFormatterPrivate extends IEntityPrivate {
}
declare type Months = "January" | "February" | "March" | "April" | "May" | "June" | "July" | "August" | "September" | "October" | "November" | "December";
declare type ShortMonths = "Jan" | "Feb" | "Mar" | "Apr" | "May(short)" | "Jun" | "Jul" | "Aug" | "Sep" | "Oct" | "Nov" | "Dec";
declare type Weekdays = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
declare type ShortWeekdays = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
export declare class DateFormatter extends Entity {
    _settings: IDateFormatterSettings;
    _privateSettings: IDateFormatterPrivate;
    protected _setDefaults(): void;
    _beforeChanged(): void;
    format(source: any, format?: string | Intl.DateTimeFormatOptions): string;
    /**
     * Applies format to Date.
     *
     * @param date      Date object
     * @param info      Parsed format information
     * @return Formatted date string
     */
    protected applyFormat(date: Date, info: DateFormatInfo): string;
    /**
     * Parses format into structured infromation.
     *
     * @param format Format template
     */
    protected parseFormat(format: string): DateFormatInfo;
    protected _months(): Months[];
    protected _getMonth(index: number): Months;
    protected _shortMonths(): ShortMonths[];
    protected _getShortMonth(index: number): ShortMonths;
    protected _weekdays(): Weekdays[];
    protected _getWeekday(index: number): Weekdays;
    protected _shortWeekdays(): ShortWeekdays[];
    protected _getShortWeekday(index: number): ShortWeekdays;
    parse(source: any, format: string): Date;
    protected resolveTimezoneOffset(date: Date, zone: string): number;
    /**
     * Resolves month name (i.e. "December") into a month number (11).
     *
     * @param value  Month name
     * @return Month number
     */
    protected resolveMonth(value: Months): number;
    /**
     * Resolves short month name (i.e. "Dec") into a month number.
     *
     * @param value  Short month name
     * @return Month number
     */
    protected resolveShortMonth(value: ShortMonths): number;
    /**
     * Checks if passed in string represents AM/PM notation in many of its
     * versions.
     *
     * @param value  Source string
     * @return Is it AM/PM?
     */
    protected isAm(value: string): boolean;
    /**
     * Translates list of strings.
     *
     * @param list  Source strings
     * @return Translated strings
     */
    protected getStringList(list: Array<keyof ILocaleSettings>): Array<string>;
}
export {};
//# sourceMappingURL=DateFormatter.d.ts.map