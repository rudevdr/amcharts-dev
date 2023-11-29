import type { Optional } from "./Type";
/**
 * Defines interface for disposable objects.
 *
 * @ignore Exclude from docs
 */
export interface IDisposer {
    isDisposed(): boolean;
    dispose(): void;
}
/**
 * A base class for disposable objects.
 *
 * @ignore Exclude from docs
 */
export declare abstract class DisposerClass implements IDisposer {
    /**
     * Is object disposed?
     */
    private _disposed;
    /**
     * Constructor.
     */
    constructor();
    /**
     * Checks if object is disposed.
     *
     * @return Disposed?
     */
    isDisposed(): boolean;
    protected abstract _dispose(): void;
    /**
     * Disposes the object.
     */
    dispose(): void;
}
/**
 * A class for creating an IDisposer.
 *
 * @ignore Exclude from docs
 */
export declare class Disposer implements IDisposer {
    /**
     * Is object disposed?
     */
    private _disposed;
    /**
     * Method that disposes the object.
     */
    private _dispose;
    /**
     * Constructor.
     *
     * @param dispose  Function that disposes object
     */
    constructor(dispose: () => void);
    /**
     * Checks if object is disposed.
     *
     * @return Disposed?
     */
    isDisposed(): boolean;
    /**
     * Disposes the object.
     */
    dispose(): void;
}
/**
 * This can be extended by other classes to add a `_disposers` property.
 *
 * @ignore Exclude from docs
 */
export declare class ArrayDisposer extends DisposerClass {
    protected _disposers: Array<IDisposer>;
    protected _dispose(): void;
}
/**
 * A collection of related disposers that can be disposed in one go.
 *
 * @ignore Exclude from docs
 */
export declare class MultiDisposer extends DisposerClass {
    protected _disposers: Array<IDisposer>;
    constructor(disposers: Array<IDisposer>);
    protected _dispose(): void;
    get disposers(): Array<IDisposer>;
}
/**
 * A special kind of Disposer that has attached value set.
 *
 * If a new value is set using `set()` method, the old disposer value is
 * disposed.
 *
 * @ignore Exclude from docs
 * @todo Description
 */
export declare class MutableValueDisposer<T extends IDisposer> extends DisposerClass {
    /**
     * Current disposer.
     */
    private _disposer;
    /**
     * Current value.
     */
    private _value;
    protected _dispose(): void;
    /**
     * Returns current value.
     *
     * @return Value
     */
    get(): Optional<T>;
    /**
     * Sets value and disposes previous disposer if it was set.
     *
     * @param value     New value
     * @param disposer  Disposer
     */
    set(value: Optional<T>, disposer: Optional<IDisposer>): void;
    /**
     * Resets the disposer value.
     */
    reset(): void;
}
/**
 * @ignore Exclude from docs
 * @todo Description
 */
export declare class CounterDisposer extends Disposer {
    /**
     * [_counter description]
     *
     * @todo Description
     */
    private _counter;
    /**
     * [increment description]
     *
     * @todo Description
     */
    increment(): Disposer;
}
//# sourceMappingURL=Disposer.d.ts.map