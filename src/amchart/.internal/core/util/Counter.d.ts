/**
 * @ignore
 */
export interface ICounterRef {
    incrementRef(): void;
    decrementRef(): void;
}
/**
 * @ignore
 */
export declare class CounterRef {
    protected _refs: number;
    protected _disposed: boolean;
    protected _dispose: () => void;
    constructor(f: () => void);
    incrementRef(): void;
    decrementRef(): void;
}
//# sourceMappingURL=Counter.d.ts.map