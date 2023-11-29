import * as $array from "./Array";
export function keys(object) {
    return Object.keys(object);
}
/**
 * Returns an array of object's property names ordered using specific ordering
 * function.
 *
 * @param object  Source object
 * @param order   Ordering function
 * @returns Object property names
 */
export function keysOrdered(object, order) {
    return keys(object).sort(order);
}
export function copy(object) {
    return Object.assign({}, object);
}
export function each(object, f) {
    keys(object).forEach((key) => {
        f(key, object[key]);
    });
}
/**
 * Iterates through all properties of the object calling `fn` for each of them.
 *
 * If return value of the function evaluates to `false` further iteration is
 * cancelled.
 *
 * @param object  Source object
 * @param fn      Callback function
 */
export function eachContinue(object, fn) {
    for (let key in object) {
        if (hasKey(object, key)) {
            if (!fn(key, object[key])) {
                break;
            }
        }
    }
}
/**
 * Orders object properties using custom `ord` function and iterates through
 * them calling `fn` for each of them.
 *
 * @param object  Source object
 * @param fn      Callback function
 * @param order   Ordering function
 */
export function eachOrdered(object, fn, ord) {
    $array.each(keysOrdered(object, ord), (key) => {
        fn(key, object[key]);
    });
}
/**
 * Checks if `object` has a specific `key`.
 *
 * @param object  Source object
 * @param key     Property name
 * @returns Has key?
 */
export function hasKey(object, key) {
    return {}.hasOwnProperty.call(object, key);
}
/**
 * Copies all properties of one object to the other, omitting undefined, but only if property in target object doesn't have a value set.
 *
 * @param fromObject  Source object
 * @param toObject    Target object
 * @return Updated target object
 * @todo Maybe consolidate with utils.copy?
 */
export function softCopyProperties(source, target) {
    each(source, (key, value) => {
        // only if value is set
        //if ($type.hasValue(value) && !($type.hasValue((<any>target)[key]))) {
        if (value != null && target[key] == null) {
            target[key] = value;
        }
    });
    return target;
}
//# sourceMappingURL=Object.js.map