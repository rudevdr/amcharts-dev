import type { Language } from "./Language";
import { Entity, IEntitySettings, IEntityPrivate } from "./Entity";
/**
 * @ignore
 */
export interface INumberSuffix {
    number: number;
    suffix: string;
}
export interface INumberFormatterSettings extends IEntitySettings {
    /**
     * Number format to be used when formatting numbers.
     *
     * @default "#,###.#####"
     */
    numberFormat?: string | Intl.NumberFormatOptions;
    /**
     * A threshold value for negative numbers.
     *
     * @default 0
     */
    negativeBase?: number;
    /**
     * Prefixes and thresholds to group big numbers into, e.g. 1M.
     *
     * Used in conjunction with `a` modifier of the number format.
     */
    bigNumberPrefixes?: INumberSuffix[];
    /**
     * Prefixes and thresholds to group small numbers into, e.g. 1m.
     *
     * Used in conjunction with `a` modifier of the number format.
     */
    smallNumberPrefixes?: INumberSuffix[];
    /**
     * All numbers below this value are considered small.
     *
     * @default 1
     */
    smallNumberThreshold?: number;
    /**
     * Prefixes to and thresholds to use when grouping data size numbers, e.g. 1MB.
     *
     * Used in conjunction with `b` modifier of the number format.
     */
    bytePrefixes?: INumberSuffix[];
    /**
     * Indicates which fields in data should be considered numeric.
     *
     * It is used when formatting data placeholder values.
     */
    numericFields?: string[];
    /**
     * Locales if you are using date formats in `Intl.NumberFormatOptions` syntax.
     *
     * @see (@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat) about using Intl for number formatting
     * @param value Locales
     */
    intlLocales?: string;
    /**
     * If set to `true` will force the number string to be LTR, even if RTL is
     * enabled.
     *
     * @default false
     * @since 5.3.13
     */
    forceLTR?: boolean;
}
export interface INumberFormatterPrivate extends IEntityPrivate {
}
/**
 * Number formatter
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/formatters/formatting-numbers/} for more info
 * @important
 */
export declare class NumberFormatter extends Entity {
    _settings: INumberFormatterSettings;
    _privateSettings: INumberFormatterPrivate;
    protected _setDefaults(): void;
    _beforeChanged(): void;
    /**
     * Formats the number according to specific format.
     *
     * @param value   Value to format
     * @param format  Format to apply
     * @return Formatted number
     */
    format(value: number | string, format?: string | Intl.NumberFormatOptions, precision?: number): string;
    /**
     * Parses supplied format into structured object which can be used to format
     * the number.
     *
     * @param format Format string, i.e. "#,###.00"
     * @param language Language
     * @ignore
     */
    protected parseFormat(format: string, language: Language): any;
    /**
     * Applies parsed format to a numeric value.
     *
     * @param value    Value
     * @param details  Parsed format as returned by parseFormat()
     * @return Formatted number
     * @ignore
     */
    protected applyFormat(value: number, details: any): string;
    protected applyPrefix(value: number, prefixes: any[], force?: boolean): any[];
    /**
     * Replaces brackets with temporary placeholders.
     *
     * @ignore Exclude from docs
     * @param text  Input text
     * @return Escaped text
     */
    escape(text: string): string;
    /**
     * Replaces placeholders back to brackets.
     *
     * @ignore Exclude from docs
     * @param text  Escaped text
     * @return Unescaped text
     */
    unescape(text: string): string;
}
//# sourceMappingURL=NumberFormatter.d.ts.map