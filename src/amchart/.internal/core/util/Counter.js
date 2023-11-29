/**
 * @ignore
 */
export class CounterRef {
    constructor(f) {
        Object.defineProperty(this, "_refs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_disposed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_dispose", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._dispose = f;
    }
    incrementRef() {
        ++this._refs;
    }
    decrementRef() {
        --this._refs;
        if (this._refs <= 0) {
            if (!this._disposed) {
                this._disposed = true;
                this._dispose();
            }
        }
    }
}
//# sourceMappingURL=Counter.js.map