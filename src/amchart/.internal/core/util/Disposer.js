/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import * as $array from "./Array";
/**
 * A base class for disposable objects.
 *
 * @ignore Exclude from docs
 */
export class DisposerClass {
    /**
     * Constructor.
     */
    constructor() {
        /**
         * Is object disposed?
         */
        Object.defineProperty(this, "_disposed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._disposed = false;
    }
    /**
     * Checks if object is disposed.
     *
     * @return Disposed?
     */
    isDisposed() {
        return this._disposed;
    }
    /**
     * Disposes the object.
     */
    dispose() {
        if (!this._disposed) {
            this._disposed = true;
            this._dispose();
        }
    }
}
/**
 * A class for creating an IDisposer.
 *
 * @ignore Exclude from docs
 */
export class Disposer {
    /**
     * Constructor.
     *
     * @param dispose  Function that disposes object
     */
    constructor(dispose) {
        /**
         * Is object disposed?
         */
        Object.defineProperty(this, "_disposed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Method that disposes the object.
         */
        Object.defineProperty(this, "_dispose", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._disposed = false;
        this._dispose = dispose;
    }
    /**
     * Checks if object is disposed.
     *
     * @return Disposed?
     */
    isDisposed() {
        return this._disposed;
    }
    /**
     * Disposes the object.
     */
    dispose() {
        if (!this._disposed) {
            this._disposed = true;
            this._dispose();
        }
    }
}
/**
 * This can be extended by other classes to add a `_disposers` property.
 *
 * @ignore Exclude from docs
 */
export class ArrayDisposer extends DisposerClass {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_disposers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
    }
    _dispose() {
        $array.each(this._disposers, (x) => {
            x.dispose();
        });
    }
}
/**
 * A collection of related disposers that can be disposed in one go.
 *
 * @ignore Exclude from docs
 */
export class MultiDisposer extends DisposerClass {
    constructor(disposers) {
        super();
        Object.defineProperty(this, "_disposers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._disposers = disposers;
    }
    _dispose() {
        $array.each(this._disposers, (x) => {
            x.dispose();
        });
    }
    get disposers() {
        return this._disposers;
    }
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
export class MutableValueDisposer extends DisposerClass {
    constructor() {
        super(...arguments);
        /**
         * Current disposer.
         */
        Object.defineProperty(this, "_disposer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Current value.
         */
        Object.defineProperty(this, "_value", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    _dispose() {
        if (this._disposer != null) {
            this._disposer.dispose();
            this._disposer = undefined;
        }
    }
    /**
     * Returns current value.
     *
     * @return Value
     */
    get() {
        return this._value;
    }
    /**
     * Sets value and disposes previous disposer if it was set.
     *
     * @param value     New value
     * @param disposer  Disposer
     */
    set(value, disposer) {
        if (this._disposer != null) {
            this._disposer.dispose();
        }
        this._disposer = disposer;
        this._value = value;
    }
    /**
     * Resets the disposer value.
     */
    reset() {
        this.set(undefined, undefined);
    }
}
/**
 * @ignore Exclude from docs
 * @todo Description
 */
export class CounterDisposer extends Disposer {
    constructor() {
        super(...arguments);
        /**
         * [_counter description]
         *
         * @todo Description
         */
        Object.defineProperty(this, "_counter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
    }
    /**
     * [increment description]
     *
     * @todo Description
     */
    increment() {
        // TODO throw an error if it is disposed
        ++this._counter;
        // TODO make this more efficient
        return new Disposer(() => {
            --this._counter;
            if (this._counter === 0) {
                this.dispose();
            }
        });
    }
}
//# sourceMappingURL=Disposer.js.map