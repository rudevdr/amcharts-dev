/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Represents a relative value (percent).
 *
 * The Percent object, can be instantiated using two ways:
 *
 * * Via `new Percent(X)`.
 * * Via `am5.percent(X)`.
 *
 * You can also use shortcut functions for `0%`, `50%`, and `100%`:
 * * `am5.p0`
 * * `am5.p50`
 * * `am5.p100`
 */
export declare class Percent {
    /**
     * Value in percent.
     */
    protected _value: number;
    /**
     * Constructor.
     *
     * @param percent  Percent value
     */
    constructor(percent: number);
    /**
     * Relative value.
     *
     * E.g. 100% is 1, 50% is 0.5, etc.
     *
     * This is useful to apply transformations to other values. E.g.:
     *
     * ```TypeScript
     * let value = 256;
     * let percent = new am5.p50;
     * console.log(value * percent.value); // outputs 128
     * ```
     * ```JavaScript
     * var value = 256;
     * var percent = new am5.p50;
     * console.log(value * percent.value); // outputs 128
     * ```
     *
     * Alternatively, you can use `am5.percent()` helper function:
     *
     * ```TypeScript
     * let value = 256;
     * let percent = am5.p50;
     * console.log(value * percent.value); // outputs 128
     * ```
     * ```JavaScript
     * var value = 256;
     * var percent = am5.p50;
     * console.log(value * percent.value); // outputs 128
     * ```
     *
     * @readonly
     * @return Relative value
     */
    get value(): number;
    /**
     * Value in percent.
     *
     * @readonly
     * @return Percent
     */
    get percent(): number;
    toString(): string;
    interpolate(min: number, max: number): number;
    static normalize(percent: Percent | number, min: number, max: number): Percent;
}
/**
 * Converts numeric percent value to a proper [[Percent]] object.
 *
 * ```TypeScript
 * pieSeries.set("radius", am5.percent(80));
 * ```
 * ```JavaScript
 * pieSeries.set("radius", am5.percent(80));
 * ```
 *
 * @param value  Percent
 * @return Percent object
 */
export declare function percent(value: number): Percent;
/**
 * A shortcut function to `am5.percent(0)`.
 */
export declare const p0: Percent;
/**
 * A shortcut function to `am5.percent(100)`.
 */
export declare const p100: Percent;
/**
 * A shortcut function to `am5.percent(50)`.
 */
export declare const p50: Percent;
/**
 * Checks if value is a [[Percent]] object.
 *
 * @ignore Exclude from docs
 * @param value  Input value
 * @return Is percent?
 */
export declare function isPercent(value: any): boolean;
//# sourceMappingURL=Percent.d.ts.map