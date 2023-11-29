export class Throttler {
    constructor(fn) {
        Object.defineProperty(this, "_ready", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "_pending", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_fn", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._fn = fn;
    }
    run() {
        if (this._ready) {
            this._ready = false;
            this._pending = false;
            requestAnimationFrame(() => {
                this._ready = true;
                if (this._pending) {
                    this.run();
                }
            });
            this._fn();
        }
        else {
            this._pending = true;
        }
    }
}
//# sourceMappingURL=Throttler.js.map