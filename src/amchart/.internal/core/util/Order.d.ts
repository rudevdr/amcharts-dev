export declare type Order = -1 | 0 | 1;
/**
 * @ignore
 */
export declare function compare<A extends string | number | boolean>(left: A, right: A): Order;
/**
 * @ignore
 */
export declare function compareArray<A>(left: ArrayLike<A>, right: ArrayLike<A>, f: (x: A, y: A) => Order): Order;
/**
 * @ignore
 */
export declare function reverse(order: Order): Order;
/**
 * @ignore
 */
export declare function compareNumber(a: number, b: number): Order;
//# sourceMappingURL=Order.d.ts.map