/** @ignore */ /** */
import * as $array from "./Array";
import * as $utils from "./Utils";
/**
 * @ignore
 */
class Native {
    constructor() {
        Object.defineProperty(this, "_observer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_targets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        this._observer = new ResizeObserver((entries) => {
            $array.each(entries, (entry) => {
                $array.each(this._targets, (x) => {
                    if (x.target === entry.target) {
                        x.callback();
                    }
                });
            });
        });
    }
    addTarget(target, callback) {
        this._observer.observe(target, { box: "border-box" });
        this._targets.push({ target, callback });
    }
    removeTarget(target) {
        this._observer.unobserve(target);
        $array.keepIf(this._targets, (x) => {
            return x.target !== target;
        });
    }
}
/**
 * @ignore
 */
class Raf {
    constructor() {
        Object.defineProperty(this, "_timer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "_targets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
    }
    addTarget(target, callback) {
        if (this._timer === null) {
            let lastTime = null;
            const loop = () => {
                const currentTime = Date.now();
                if (lastTime === null || currentTime > (lastTime + Raf.delay)) {
                    lastTime = currentTime;
                    $array.each(this._targets, (x) => {
                        let newSize = x.target.getBoundingClientRect();
                        if (newSize.width !== x.size.width || newSize.height !== x.size.height) {
                            x.size = newSize;
                            x.callback();
                        }
                    });
                }
                if (this._targets.length === 0) {
                    this._timer = null;
                }
                else {
                    this._timer = requestAnimationFrame(loop);
                }
            };
            this._timer = requestAnimationFrame(loop);
        }
        // We start off with fake bounds so that sensor always kicks in
        let size = { width: 0, height: 0, left: 0, right: 0, top: 0, bottom: 0, x: 0, y: 0 };
        this._targets.push({ target, callback, size });
    }
    removeTarget(target) {
        $array.keepIf(this._targets, (x) => {
            return x.target !== target;
        });
        if (this._targets.length === 0) {
            if (this._timer !== null) {
                cancelAnimationFrame(this._timer);
                this._timer = null;
            }
        }
    }
}
Object.defineProperty(Raf, "delay", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 200
});
/**
 * @ignore
 */
let observer = null;
/**
 * @ignore
 */
function makeSensor() {
    if (observer === null) {
        if (typeof ResizeObserver !== "undefined") {
            observer = new Native();
        }
        else {
            observer = new Raf();
        }
    }
    return observer;
}
/**
 * @ignore
 */
export class ResizeSensor {
    constructor(element, callback) {
        Object.defineProperty(this, "_sensor", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_element", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_listener", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_disposed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        this._sensor = makeSensor();
        this._element = element;
        // This is needed because we need to know when the window is zoomed
        this._listener = $utils.onZoom(callback);
        this._sensor.addTarget(element, callback);
    }
    isDisposed() {
        return this._disposed;
    }
    dispose() {
        if (!this._disposed) {
            this._disposed = true;
            this._sensor.removeTarget(this._element);
            this._listener.dispose();
        }
    }
    get sensor() {
        return this._sensor;
    }
}
//# sourceMappingURL=ResizeSensor.js.map