/**
 * @ignore
 */
export function compare(left, right) {
    if (left === right) {
        return 0;
    }
    else if (left < right) {
        return -1;
    }
    else {
        return 1;
    }
}
/**
 * @ignore
 */
export function compareArray(left, right, f) {
    const leftLength = left.length;
    const rightLength = right.length;
    const length = Math.min(leftLength, rightLength);
    for (let i = 0; i < length; ++i) {
        const order = f(left[i], right[i]);
        if (order !== 0) {
            return order;
        }
    }
    return compare(leftLength, rightLength);
}
/**
 * @ignore
 */
export function reverse(order) {
    if (order < 0) {
        return 1;
    }
    else if (order > 0) {
        return -1;
    }
    else {
        return 0;
    }
}
/**
 * @ignore
 */
export function compareNumber(a, b) {
    if (a === b) {
        return 0;
    }
    else if (a < b) {
        return -1;
    }
    else {
        return 1;
    }
}
//# sourceMappingURL=Order.js.map