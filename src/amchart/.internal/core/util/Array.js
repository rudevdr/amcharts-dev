import * as $type from "./Type";
/**
 * ============================================================================
 * UTILITY FUNCTIONS
 * ============================================================================
 * @hidden
 */
/**
 * Searches `array` for `value`.
 *
 * Returns -1 if not found.
 *
 * @param array  Source array
 * @param value  Value to search
 * @returns Index
 */
export function indexOf(array, value) {
    const length = array.length;
    for (let i = 0; i < length; ++i) {
        // TODO handle NaN
        if (array[i] === value) {
            return i;
        }
    }
    return -1;
}
/**
 * Calls `test` for each element in `array`.
 *
 * If `test` returns `true` then it immediately returns `true`.
 *
 * If `test` returns `false` for all of the elements in `array` then it returns `false`.
 *
 * @param array  Source array
 * @param test   Function which is called on each element
 * @returns Whether `test` returned true or not
 */
export function any(array, test) {
    const length = array.length;
    for (let i = 0; i < length; ++i) {
        if (test(array[i])) {
            return true;
        }
    }
    return false;
}
/**
 * Calls `fn` function for every member of array and returns a new array out
 * of all outputs.
 *
 * @param array  Source array
 * @param fn     Callback function
 * @returns New array
 */
export function map(array, fn) {
    const length = array.length;
    const output = new Array(length);
    for (let i = 0; i < length; ++i) {
        output[i] = fn(array[i], i);
    }
    return output;
}
/**
 * Iterates through all items in array and calls `fn` function for each of
 * them.
 *
 * @param array  Source array
 * @param fn     Callback function
 */
export function each(array, fn) {
    const length = array.length;
    for (let i = 0; i < length; ++i) {
        fn(array[i], i);
    }
}
/**
 * Iterates through all items in array in reverse order and calls `fn` function for each of
 * them.
 *
 * @param array  Source array
 * @param fn     Callback function
 */
export function eachReverse(array, fn) {
    let i = array.length;
    while (i > 0) {
        --i;
        fn(array[i], i);
    }
}
/**
 * Iterates through all items in array and calls `fn` function for each of
 * them.
 *
 * If `fn` call evaluates to `false`, further iteration is cancelled.
 *
 * @param array  Source array
 * @param fn     Callback function
 */
export function eachContinue(array, fn) {
    const length = array.length;
    for (let i = 0; i < length; ++i) {
        if (!fn(array[i], i)) {
            break;
        }
    }
}
/**
 * Shifts an item at `index` towards beginning of the array.
 *
 * @param array  Source array
 * @param index  Target element index
 */
export function shiftLeft(array, index) {
    const length = array.length;
    for (let i = index; i < length; ++i) {
        array[i - index] = array[i];
    }
    array.length = length - index;
}
/**
 * Returns the last item of the array.
 *
 * @param array  Source array
 * @returns Last item
 */
export function last(array) {
    const length = array.length;
    return length ? array[length - 1] : undefined;
}
/**
 * Returns the first item of the array.
 *
 * @param array  Source array
 * @returns Last item
 */
export function first(array) {
    return array[0];
}
/**
 * Inserts `element` into `array` at `index`.
 *
 * Caps `index` to be between `0` and `array.length`
 *
 * @param array    Source array
 * @param element  Item to insert
 * @param array    Index to insert item at
 */
export function insert(array, element, index) {
    //if (array) {
    index = Math.max(0, Math.min(index, array.length));
    array.splice(index, 0, element);
    //}
}
/**
 * Removes all copies of `element` from `array` (if they exist) and then
 * inserts `element` at `index`.
 *
 * @param array    Source array
 * @param element  Item
 * @param array    Index to move item to
 */
export function setIndex(array, element, index) {
    remove(array, element);
    insert(array, element, index);
}
/**
 * Pushes all of the elements from `input` into `array`.
 *
 * @param array  Output array
 * @param input  Input array
 */
export function pushAll(array, input) {
    const length = input.length;
    for (let i = 0; i < length; ++i) {
        array.push(input[i]);
    }
}
/**
 * Removes `element` from `array`.
 *
 * If there are multiple copies of `element`, they are all removed.
 *
 * @param array    Source array
 * @param element  Item to remove
 */
export function remove(array, element) {
    let found = false;
    let index = 0;
    for (;;) {
        index = array.indexOf(element, index);
        if (index === -1) {
            return found;
        }
        else {
            found = true;
            array.splice(index, 1);
        }
    }
}
export function removeFirst(array, element) {
    let index = array.indexOf(element);
    if (index !== -1) {
        array.splice(index, 1);
        return true;
    }
    else {
        return false;
    }
}
/**
 * Adds an `element` to `array`.
 *
 * If array already contains and item like this, it is removed before adding
 * it again.
 *
 * Optionally `toIndex` can be specified to add element at specific index.
 *
 * @param array    Source array
 * @param element  Item to add
 * @param array    Index to move item to
 */
export function move(array, element, toIndex) {
    // @todo this implementation must be the same as the List.moveValue method
    // @todo don't do anything if the desired index is the same as the current index
    let index = indexOf(array, element);
    // @todo remove all old values rather than only the first ?
    if (index !== -1) {
        removeIndex(array, index);
    }
    if (toIndex == null) {
        array.push(element);
    }
    else {
        insertIndex(array, toIndex, element);
    }
}
/**
 * Inserts `element` into `array` at `index`.
 *
 * If `index` is not provided, it will insert `element` at the end of `array`.
 *
 * @param array    Source array
 * @param element  Item to add
 * @param array    Index to add item at
 */
export function add(array, element, index) {
    // Append to the end if index is not set
    if (!$type.isNumber(index)) {
        array.push(element);
    }
    // Add to the beginning of array if index is 0
    else if (index === 0) {
        array.unshift(element);
    }
    // Add to indicated place if index is set
    else {
        array.splice(index, 0, element);
    }
}
/**
 * Pushes `element` into `array` if it doesn't already exist.
 *
 * @param array    Source array
 * @param element  Item to add
 */
export function pushOne(array, element) {
    if (array.indexOf(element) === -1) {
        array.push(element);
    }
}
/**
 * Removes `element` from `array` (if it exists) and then inserts `element` at
 * `index`.
 *
 * If `index` is not provided, it will insert `element` at the end of `array`.
 *
 * @param array    Source array
 * @param element  Item to remove
 * @param array    Index to move item to
 */
export function replace(array, element, index) {
    // check if exists
    let ind = array.indexOf(element);
    // remove if exists
    if (ind !== -1) {
        array.splice(ind, 1);
    }
    // add to end if index is not set
    if (!$type.isNumber(index)) {
        array.push(element);
    }
    // add to indicated place if index is set
    else {
        array.splice(index, 0, element);
    }
}
/**
 * Wraps `input` in an array, if it isn't already an array.
 *
 * @param input  Source value
 * @return An array
 */
export function toArray(input) {
    if (Array.isArray(input)) {
        return input;
    }
    else {
        return [input];
    }
}
/**
 * Returns `true` if `element` exists in `array`.
 *
 * @param array    Source array
 * @param element  Item to search for
 * @returns Item in array?
 */
export function has(array, element) {
    return indexOf(array, element) !== -1;
}
/**
 * Returns a shallow copy of `array`.
 *
 * @param array  Source array
 * @returns Copy of the array
 */
export function copy(array) {
    const length = array.length;
    // It's faster to create the array with a pre-defined length
    const output = new Array(length);
    for (let i = 0; i < length; ++i) {
        // Because the array has a pre-defined length, we have to assign rather than push
        // This is also faster than pushing
        output[i] = array[i];
    }
    return output;
}
/**
 * Returns a copy of `array` which contains all the elements between `start`
 * and `end`. (including `start` and excluding `end`)
 *
 * If `end` is not provided, it defaults to `array.length`.
 *
 * @param array  Source array
 * @param start  Start index
 * @param end    End index
 * @returns Part of the array
 */
export function slice(array, start, end = array.length) {
    const output = new Array(end - start);
    for (let i = start; i < end; ++i) {
        output[i - start] = array[i];
    }
    return output;
}
/**
 * Inserts a value into array at specific index.
 *
 * @param array  Source array
 * @param index  Index
 * @param value  Value to insert
 */
export function insertIndex(array, index, value) {
    array.splice(index, 0, value);
}
/**
 * Removes a value from array at specific index.
 *
 * @param array  Source array
 * @param index  Index
 */
export function removeIndex(array, index) {
    array.splice(index, 1);
}
/**
 * Searches the array using custom function and returns index of the item if
 * found.
 *
 * Will call `matches` function on all items of the array. If return value
 * evaluates to `true`, index is returned.
 *
 * Otherwise returns -1.
 *
 * @param array    Source array
 * @param matches  Search function
 * @returns Index of the item if found
 */
export function findIndex(array, matches) {
    const length = array.length;
    for (let i = 0; i < length; ++i) {
        if (matches(array[i], i)) {
            return i;
        }
    }
    return -1;
}
/**
 * This is the same as `findIndex` except it searches from right to left.
 *
 * @param array    Source array
 * @param matches  Search function
 * @returns Index of the item if found
 */
export function findIndexReverse(array, matches) {
    let i = array.length;
    while (i > 0) {
        --i;
        if (matches(array[i], i)) {
            return i;
        }
    }
    return -1;
}
/**
 * Searches the array using custom function and returns item if found.
 *
 * Will call `matches` function on all items of the array. If return value
 * evaluates to `true`, index is returned.
 *
 * Otherwise returns `undefined`.
 *
 * @param array    Source array
 * @param matches  Search function
 * @returns Item if found
 */
export function find(array, matches) {
    const index = findIndex(array, matches);
    if (index !== -1) {
        return array[index];
    }
}
/**
 * This is the same as `find` except it searches from right to left.
 *
 * @param array    Source array
 * @param matches  Search function
 * @returns Item if found
 */
export function findReverse(array, matches) {
    const index = findIndexReverse(array, matches);
    if (index !== -1) {
        return array[index];
    }
}
/**
 * Searches the array using custom function and returns item if found.
 *
 * Will call `matches` function on all items of the array. If value
 * is not `undefined`, it returns it.
 *
 * Otherwise returns `undefined`.
 *
 * @param array    Source array
 * @param matches  Search function
 * @returns Item if found
 */
export function findMap(array, matches) {
    const length = array.length;
    for (let i = 0; i < length; ++i) {
        const value = matches(array[i], i);
        if (value !== undefined) {
            return value;
        }
    }
}
/**
 * Iterates through all items in array and calls `fn` function for each of
 * them.
 *
 * @param array  Source array
 * @param fn     Callback function
 */
export function shuffle(array) {
    // https://stackoverflow.com/a/2450976/449477
    let currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
}
/**
 * Orders an array using specific `ordering` function and returns right-most index of
 * the `value`.
 *
 * @ignore Exclude from docs
 * @param array     Source array
 * @param ordering  An ordering function
 * @returns Result of the search
 */
export function getSortedIndex(array, ordering) {
    let start = 0;
    let end = array.length;
    let found = false;
    while (start < end) {
        // TODO is this faster/slower than using Math.floor ?
        const pivot = (start + end) >> 1;
        const order = ordering(array[pivot]);
        // less
        if (order < 0) {
            start = pivot + 1;
            // equal
        }
        else if (order === 0) {
            found = true;
            start = pivot + 1;
            // more
        }
        else {
            end = pivot;
        }
    }
    return {
        found: found,
        index: (found ? start - 1 : start)
    };
}
/**
 * Orders an array using specific `ordering` function and returns left-most index of
 * the `value`.
 *
 * @ignore Exclude from docs
 * @param array     Source array
 * @param ordering  An ordering function
 * @returns Result of the search
 */
export function getFirstSortedIndex(array, ordering) {
    let start = 0;
    let end = array.length;
    let found = false;
    while (start < end) {
        // TODO is this faster/slower than using Math.floor ?
        const pivot = (start + end) >> 1;
        const order = ordering(array[pivot]);
        // less
        if (order < 0) {
            start = pivot + 1;
            // equal
        }
        else if (order === 0) {
            found = true;
            end = pivot;
            // more
        }
        else {
            end = pivot;
        }
    }
    return {
        found: found,
        index: start
    };
}
export function keepIf(array, keep) {
    let i = array.length;
    while (i > 0) {
        --i;
        if (!keep(array[i])) {
            array.splice(i, 1);
        }
    }
}
//# sourceMappingURL=Array.js.map