/**
 * A collection of utility functions for various type checks and conversion
 * @hidden
 */
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
export function isNaN(value) {
    return Number(value) !== value;
}
/**
 * Returns a type of the value.
 *
 * @param value  Input value
 * @return Type of the value
 * @ignore
 */
export function getType(value) {
    return ({}).toString.call(value);
}
/**
 * Asserts that the condition is true.
 *
 * @param condition  Condition to check
 * @param message    Message to display in the error
 * @ignore
 */
export function assert(condition, message = "Assertion failed") {
    if (!condition) {
        throw new Error(message);
    }
}
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
export function toNumber(value) {
    if (value != null && !isNumber(value)) {
        let converted = Number(value);
        if (isNaN(converted) && isString(value) && value != "") {
            return toNumber(value.replace(/[^0-9.\-]+/g, ''));
        }
        return converted;
    }
    return value;
}
/**
 * Converts anything to Date object.
 *
 * @param value  A value of any type
 * @return Date object representing a value
 */
export function toDate(value) {
    if (isDate(value)) {
        // TODO maybe don't create a new Date ?
        return new Date(value);
    }
    else if (isNumber(value)) {
        return new Date(value);
    }
    else {
        // Try converting to number (assuming timestamp)
        let num = Number(value);
        if (!isNumber(num)) {
            return new Date(value);
        }
        else {
            return new Date(num);
        }
    }
}
/**
 * Converts numeric value into string. Deals with large or small numbers that
 * would otherwise use exponents.
 *
 * @param value  Numeric value
 * @return Numeric value as string
 */
export function numberToString(value) {
    // TODO handle Infinity and -Infinity
    if (isNaN(value)) {
        return "NaN";
    }
    if (value === Infinity) {
        return "Infinity";
    }
    if (value === -Infinity) {
        return "-Infinity";
    }
    // Negative 0
    if ((value === 0) && (1 / value === -Infinity)) {
        return "-0";
    }
    // Preserve negative and deal with absoute values
    let negative = value < 0;
    value = Math.abs(value);
    // TODO test this
    let parsed = /^([0-9]+)(?:\.([0-9]+))?(?:e[\+\-]([0-9]+))?$/.exec("" + value);
    let digits = parsed[1];
    let decimals = parsed[2] || "";
    let res;
    // Leave the nummber as it is if it does not use exponents
    if (parsed[3] === undefined) {
        res = (decimals === "" ? digits : digits + "." + decimals);
    }
    else {
        let exponent = +parsed[3];
        // Deal with decimals
        if (value < 1) {
            let zeros = exponent - 1;
            res = "0." + repeat("0", zeros) + digits + decimals;
            // Deal with integers
        }
        else {
            let zeros = exponent - decimals.length;
            if (zeros === 0) {
                res = digits + decimals;
            }
            else if (zeros < 0) {
                res = digits + decimals.slice(0, zeros) + "." + decimals.slice(zeros);
            }
            else {
                res = digits + decimals + repeat("0", zeros);
            }
        }
    }
    return negative ? "-" + res : res;
}
/**
 * Repeats a `string` number of times as set in `amount`.
 *
 * @ignore Exclude from docs
 * @todo Make this faster
 * @param string  Source string
 * @param amount  Number of times to repeat string
 * @return New string
 */
export function repeat(string, amount) {
    return new Array(amount + 1).join(string);
}
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
export function isDate(value) {
    return getType(value) === "[object Date]";
}
/**
 * Checks if parameter is `string`.
 *
 * @param value  Input value
 * @return Is string?
 */
export function isString(value) {
    return typeof value === "string";
}
/**
 * Checks if parameter is `number`.
 *
 * @param value  Input value
 * @return Is number?
 */
export function isNumber(value) {
    return typeof value === "number" && Number(value) == value;
}
/**
 * Checks if parameter is `object`.
 *
 * @param value  Input value
 * @return Is object?
 */
export function isObject(value) {
    return typeof value === "object" && value !== null;
}
/**
 * Checks if parameter is `Array`.
 *
 * @param value  Input value
 * @return Is Array?
 */
export function isArray(value) {
    return Array.isArray(value);
}
/**
 * ============================================================================
 * STATIC CONSTANTS
 * ============================================================================
 * @hidden
 */
/**
 * @ignore Exclude from docs
 */
export const PLACEHOLDER = "__§§§__";
/**
 * @ignore Exclude from docs
 */
export const PLACEHOLDER2 = "__§§§§__";
//# sourceMappingURL=Type.js.map