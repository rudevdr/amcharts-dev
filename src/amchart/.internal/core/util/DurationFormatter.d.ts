import type { TimeUnit } from "./Time";
import { Entity, IEntitySettings, IEntityPrivate } from "./Entity";
export interface IDurationFormatterSettings extends IEntitySettings {
    /**
     * A universal duration format to use wherever number needs to be formatted
     * as a duration.
     */
    durationFormat?: string;
    /**
     * A base value. Any number below it will be considered "negative".
     *
     * @default 0
     */
    negativeBase?: number;
    /**
     * Identifies what values are used in duration.
     *
     * Available options: `"millisecond"`, `"second"` (default), `"minute"`, `"hour"`, `"day"`, `"week"`, `"month"`, and `"year"`.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/formatters/formatting-durations/#Base_unit} for more info
     * @default "second"
     */
    baseUnit?: TimeUnit;
    /**
     * Time unit dependent duration formats.
     *
     * Used be [[DurationAxis]].
     */
    durationFormats?: Partial<Record<TimeUnit, Partial<Record<TimeUnit, string>>>>;
    /**
     * An array of data fields that hold duration values and should be formatted
     * with a [[DurationFormatter]].
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/formatters/data-placeholders/#Formatting_placeholders} for more info
     */
    durationFields?: string[];
}
export interface IDurationFormatterPrivate extends IEntityPrivate {
}
/**
 * A class used to format numberic values as time duration.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/formatters/formatting-durations/} for more info
 */
export declare class DurationFormatter extends Entity {
    _settings: IDurationFormatterSettings;
    _privateSettings: IDurationFormatterPrivate;
    protected _setDefaults(): void;
    /**
     * Collection of aliases for units.
     */
    protected _unitAliases: {
        [index: string]: string;
    };
    _beforeChanged(): void;
    /**
     * Formats the number as duration.
     *
     * For example `1000` (base unit seconds) would be converted to `16:40` as in
     * 16 minutes and 40 seconds.
     *
     * @param value   Value to format
     * @param format  Format to apply
     * @param base    Override base unit
     * @return Formatted number
     */
    format(value: number | string, format?: string, base?: TimeUnit): string;
    /**
     * Parses supplied format into structured object which can be used to format
     * the number.
     *
     * @param format  Format string, i.e. "#,###.00"
     * @param base    Override base unit
     * @return Parsed information
     */
    protected parseFormat(format: string, base?: TimeUnit): any;
    /**
     * Applies parsed format to a numeric value.
     *
     * @param value    Value
     * @param details  Parsed format as returned by {parseFormat}
     * @return Formatted duration
     */
    protected applyFormat(value: number, details: any): string;
    /**
     * Converts numeric value to timestamp in milliseconds.
     *
     * @param value     A source value
     * @param baseUnit  Base unit the source value is in: "q", "s", "i", "h", "d", "w", "m", "y"
     * @return Value representation as a timestamp in milliseconds
     */
    toTimeStamp(value: number, baseUnit: TimeUnit): number;
    protected _toTimeUnit(code: string): TimeUnit | undefined;
    /**
     * Returns appropriate default format for the value.
     *
     * If `maxValue` is sepcified, it will use that value to determine the time
     * unit for the format.
     *
     * For example if your `baseUnit` is `"second"` and you pass in `10`, you
     * will get `"10"`.
     *
     * However, you might want it to be formatted in the context of bigger scale,
     * say 10 minutes (600 seconds). If you pass in `600` as `maxValue`, all
     * values, including small ones will use format with minutes, e.g.:
     * `00:10`, `00:50`, `12: 30`, etc.
     *
     * @param value     Value to format
     * @param maxValue  Maximum value to be used to determine format
     * @param baseUnit  Base unit of the value
     * @return Format
     */
    getFormat(value: number, maxValue?: number, baseUnit?: TimeUnit): string;
    /**
     * Returns value's closest denominator time unit, e.g 100 seconds is
     * `"minute"`, while 59 seconds would still be `second`.
     *
     * @param value     Source duration value
     * @param baseUnit  Base unit
     * @return Denominator
     */
    getValueUnit(value: number, baseUnit?: TimeUnit): TimeUnit | undefined;
    /**
     * Converts value to milliseconds according to `baseUnit`.
     *
     * @param value     Source duration value
     * @param baseUnit  Base unit
     * @return Value in milliseconds
     */
    getMilliseconds(value: number, baseUnit?: TimeUnit): number;
    protected _getUnitValue(timeUnit: TimeUnit): number;
    protected _getUnitValues(): any;
}
//# sourceMappingURL=DurationFormatter.d.ts.map