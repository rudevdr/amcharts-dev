import type { Keyof } from "./Type";
export declare function keys<O>(object: O): Array<Keyof<O>>;
/**
 * Returns an array of object's property names ordered using specific ordering
 * function.
 *
 * @param object  Source object
 * @param order   Ordering function
 * @returns Object property names
 */
export declare function keysOrdered<Object>(object: Object, order: (a: Keyof<Object>, b: Keyof<Object>) => number): Array<Keyof<Object>>;
export declare function copy<O>(object: O): O;
export declare function each<O>(object: O, f: <K extends keyof O>(key: K, value: Exclude<O[K], undefined>) => void): void;
/**
 * Iterates through all properties of the object calling `fn` for each of them.
 *
 * If return value of the function evaluates to `false` further iteration is
 * cancelled.
 *
 * @param object  Source object
 * @param fn      Callback function
 */
export declare function eachContinue<Object>(object: Object, fn: <Key extends Keyof<Object>>(key: Key, value: Object[Key]) => boolean): void;
/**
 * Orders object properties using custom `ord` function and iterates through
 * them calling `fn` for each of them.
 *
 * @param object  Source object
 * @param fn      Callback function
 * @param order   Ordering function
 */
export declare function eachOrdered<Object>(object: Object, fn: <Key extends Keyof<Object>>(key: Key, value: Object[Key]) => void, ord: (a: Keyof<Object>, b: Keyof<Object>) => number): void;
/**
 * Checks if `object` has a specific `key`.
 *
 * @param object  Source object
 * @param key     Property name
 * @returns Has key?
 */
export declare function hasKey<Object, Key extends keyof Object>(object: Object, key: Key): boolean;
/**
 * Copies all properties of one object to the other, omitting undefined, but only if property in target object doesn't have a value set.
 *
 * @param fromObject  Source object
 * @param toObject    Target object
 * @return Updated target object
 * @todo Maybe consolidate with utils.copy?
 */
export declare function softCopyProperties(source: Object, target: Object): Object;
//# sourceMappingURL=Object.d.ts.map