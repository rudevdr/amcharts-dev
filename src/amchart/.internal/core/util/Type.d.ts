/**
 * A collection of utility functions for various type checks and conversion
 * @hidden
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
/**
 * ============================================================================
 * MISC
 * ============================================================================
 * @hidden
 */
declare type Cond<T, Keys extends keyof T> = Keys extends never ? never : {
    [K in Keys]: T[K];
};
declare type Never<T> = T extends undefined ? never : T;
/**
 * Selects all the keys of T which have a value of U.
 */
export declare type SelectKeys<T, U> = Never<{
    [K in keyof T]: T[K] extends U ? K : never;
}[keyof T]>;
/**
 * Creates a new type which is the same as T except it only has the properties of type U.
 */
export declare type Select<T, U> = Cond<T, SelectKeys<T, U>>;
/**
 * @todo Description
 * @ignore Exclude from docs
 */
export declare type Public<T> = {
    [P in keyof T]: T[P];
};
/**
 * `Keyof<T>` is the same as `keyof T` except it only accepts string keys, not numbers or symbols.
 */
export declare type Keyof<T> = Extract<keyof T, string>;
/**
 * ============================================================================
 * TYPE CHECK
 * ============================================================================
 * @hidden
 */
/**
 * Returns `true` if value is not a number (NaN).
 *
 * @param value Input value
 * @return Is NaN?
 */
export declare function isNaN(value: number): boolean;
/**
 * Represents a type for all available JavaScript variable types.
 */
export declare type Type = "[object Object]" | "[object Array]" | "[object String]" | "[object Number]" | "[object Boolean]" | "[object Date]";
/**
 * Returns a type of the value.
 *
 * @param value  Input value
 * @return Type of the value
 * @ignore
 */
export declare function getType<A>(value: A): Type;
/**
 * Asserts that the condition is true.
 *
 * @param condition  Condition to check
 * @param message    Message to display in the error
 * @ignore
 */
export declare function assert(condition: boolean, message?: string): asserts condition;
/**
 * ============================================================================
 * QUICK CONVERSION
 * ============================================================================
 * @hidden
 */
/**
 * Converts any value into a `number`.
 *
 * @param value  Source value
 * @return Number representation of value
 */
export declare function toNumber(value: any): number;
/**
 * Converts anything to Date object.
 *
 * @param value  A value of any type
 * @return Date object representing a value
 */
export declare function toDate(value: Date | number | string): Date;
/**
 * Converts numeric value into string. Deals with large or small numbers that
 * would otherwise use exponents.
 *
 * @param value  Numeric value
 * @return Numeric value as string
 */
export declare function numberToString(value: number): string;
/**
 * Repeats a `string` number of times as set in `amount`.
 *
 * @ignore Exclude from docs
 * @todo Make this faster
 * @param string  Source string
 * @param amount  Number of times to repeat string
 * @return New string
 */
export declare function repeat(string: string, amount: number): string;
/**
 * ============================================================================
 * VALUE PRESENCE CHECK
 * ============================================================================
 * @hidden
 */
/**
 * Defines an optional value that can be of any type or `undefined`.
 */
export declare type Optional<A> = A | undefined;
/**
 * ============================================================================
 * TYPE CHECK
 * ============================================================================
 * @hidden
 */
/**
 * Checks if parameter is `Date`.
 *
 * @param value  Input value
 * @return Is Date?
 */
export declare function isDate(value: any): value is Date;
/**
 * Checks if parameter is `string`.
 *
 * @param value  Input value
 * @return Is string?
 */
export declare function isString(value: any): value is string;
/**
 * Checks if parameter is `number`.
 *
 * @param value  Input value
 * @return Is number?
 */
export declare function isNumber(value: any): value is number;
/**
 * Checks if parameter is `object`.
 *
 * @param value  Input value
 * @return Is object?
 */
export declare function isObject(value: any): value is object;
/**
 * Checks if parameter is `Array`.
 *
 * @param value  Input value
 * @return Is Array?
 */
export declare function isArray(value: any): value is Array<unknown>;
/**
 * ============================================================================
 * STATIC CONSTANTS
 * ============================================================================
 * @hidden
 */
/**
 * @ignore Exclude from docs
 */
export declare const PLACEHOLDER: string;
/**
 * @ignore Exclude from docs
 */
export declare const PLACEHOLDER2: string;
export {};
//# sourceMappingURL=Type.d.ts.map