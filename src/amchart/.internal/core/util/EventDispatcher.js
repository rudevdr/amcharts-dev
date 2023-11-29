/**
 * Event Dispatcher module is used for registering listeners and dispatching
 * events across amCharts system.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Disposer, MultiDisposer } from "./Disposer";
import * as $array from "./Array";
import * as $type from "./Type";
/**
 * Universal Event Dispatcher.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/events/} for more info
 */
export class EventDispatcher {
    /**
     * Constructor
     */
    constructor() {
        Object.defineProperty(this, "_listeners", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_killed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_disabled", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_iterating", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_enabled", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_disposed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._listeners = [];
        this._killed = [];
        this._disabled = {};
        this._iterating = 0;
        this._enabled = true;
        this._disposed = false;
    }
    /**
     * Returns if this object has been already disposed.
     *
     * @return Disposed?
     */
    isDisposed() {
        return this._disposed;
    }
    /**
     * Dispose (destroy) this object.
     */
    dispose() {
        if (!this._disposed) {
            this._disposed = true;
            const a = this._listeners;
            this._iterating = 1;
            this._listeners = null;
            this._disabled = null;
            try {
                $array.each(a, (x) => {
                    x.disposer.dispose();
                });
            }
            finally {
                this._killed = null;
                this._iterating = null;
            }
        }
    }
    /**
     * Checks if this particular event dispatcher has any listeners set.
     *
     * @return Has listeners?
     */
    hasListeners() {
        return this._listeners.length !== 0;
    }
    /**
     * Checks if this particular event dispatcher has any particular listeners set.
     *
     * @return Has particular event listeners?
     */
    hasListenersByType(type) {
        return $array.any(this._listeners, (x) => (x.type === null || x.type === type) && !x.killed);
    }
    /**
     * Enable dispatching of events if they were previously disabled by
     * `disable()`.
     */
    enable() {
        this._enabled = true;
    }
    /**
     * Disable dispatching of events until re-enabled by `enable()`.
     */
    disable() {
        this._enabled = false;
    }
    /**
     * Enable dispatching particular event, if it was disabled before by
     * `disableType()`.
     *
     * @param type Event type
     */
    enableType(type) {
        delete this._disabled[type];
    }
    /**
     * Disable dispatching of events for a certain event type.
     *
     * Optionally, can set how many dispatches to skip before automatically
     * re-enabling the dispatching.
     *
     * @param type    Event type
     * @param amount  Number of event dispatches to skip
     */
    disableType(type, amount = Infinity) {
        this._disabled[type] = amount;
    }
    /**
     * Removes listener from dispatcher.
     *
     * Will throw an exception if such listener does not exists.
     *
     * @param listener Listener to remove
     */
    _removeListener(listener) {
        if (this._iterating === 0) {
            const index = this._listeners.indexOf(listener);
            if (index === -1) {
                throw new Error("Invalid state: could not remove listener");
            }
            this._listeners.splice(index, 1);
        }
        else {
            this._killed.push(listener);
        }
    }
    /**
     * Removes existing listener by certain parameters.
     *
     * @param once         Listener's once setting
     * @param type         Listener's type
     * @param callback     Callback function
     * @param context      Callback context
     */
    _removeExistingListener(once, type, callback, context) {
        if (this._disposed) {
            throw new Error("EventDispatcher is disposed");
        }
        this._eachListener((info) => {
            if (info.once === once && // TODO is this correct ?
                info.type === type &&
                (callback === undefined || info.callback === callback) &&
                info.context === context) {
                info.disposer.dispose();
            }
        });
    }
    /**
     * Checks if dispatching for particular event type is enabled.
     *
     * @param type  Event type
     * @return Enabled?
     */
    isEnabled(type) {
        if (this._disposed) {
            throw new Error("EventDispatcher is disposed");
        }
        // TODO is this check correct ?
        return this._enabled && this._listeners.length > 0 && this.hasListenersByType(type) && this._disabled[type] === undefined;
    }
    /**
     * Removes all listeners of a particular event type
     *
     * @param type  Listener's type
     */
    removeType(type) {
        if (this._disposed) {
            throw new Error("EventDispatcher is disposed");
        }
        this._eachListener((info) => {
            if (info.type === type) {
                info.disposer.dispose();
            }
        });
    }
    /**
     * Checks if there's already a listener with specific parameters.
     *
     * @param type      Listener's type
     * @param callback  Callback function
     * @param context   Callback context
     * @return Has listener?
     */
    has(type, callback, context) {
        const index = $array.findIndex(this._listeners, (info) => {
            return info.once !== true && // Ignoring "once" listeners
                info.type === type &&
                (callback === undefined || info.callback === callback) &&
                info.context === context;
        });
        return index !== -1;
    }
    /**
     * Checks whether event of the particular type should be dispatched.
     *
     * @param type  Event type
     * @return Dispatch?
     */
    _shouldDispatch(type) {
        if (this._disposed) {
            throw new Error("EventDispatcher is disposed");
        }
        const count = this._disabled[type];
        if (!$type.isNumber(count)) {
            return this._enabled;
        }
        else {
            if (count <= 1) {
                delete this._disabled[type];
            }
            else {
                --this._disabled[type];
            }
            return false;
        }
    }
    /**
     * [_eachListener description]
     *
     * All of this extra code is needed when a listener is removed while iterating
     *
     * @todo Description
     * @param fn [description]
     */
    _eachListener(fn) {
        ++this._iterating;
        try {
            $array.each(this._listeners, fn);
        }
        finally {
            --this._iterating;
            // TODO should this be inside or outside the finally ?
            if (this._iterating === 0 && this._killed.length !== 0) {
                // Remove killed listeners
                $array.each(this._killed, (killed) => {
                    this._removeListener(killed);
                });
                this._killed.length = 0;
            }
        }
    }
    /**
     * Dispatches an event immediately without waiting for next cycle.
     *
     * @param type   Event type
     * @param event  Event object
     * @todo automatically add in type and target properties if they are missing
     */
    dispatch(type, event) {
        if (this._shouldDispatch(type)) {
            // TODO check if it's faster to use an object of listeners rather than a single big array
            // TODO if the function throws, maybe it should keep going ?
            this._eachListener((listener) => {
                if (!listener.killed && (listener.type === null || listener.type === type)) {
                    listener.dispatch(type, event);
                }
            });
        }
    }
    /**
     * Shelves the event to be dispatched within next update cycle.
     *
     * @param type   Event type
     * @param event  Event object
     * @todo automatically add in type and target properties if they are missing
     */
    /*public dispatchLater<Key extends keyof T>(type: Key, event: T[Key]): void {
        if (this._shouldDispatch(type)) {
            this._eachListener((listener) => {
                // TODO check if it's faster to use an object of listeners rather than a single big array
                if (!listener.killed && (listener.type === null || listener.type === type)) {
                    // TODO if the function throws, maybe it should keep going ?
                    // TODO dispatch during the update cycle, rather than using whenIdle
                    $async.whenIdle(() => {
                        if (!listener.killed) {
                            listener.dispatch(type, event);
                        }
                    });
                }
            });
        }
    }*/
    /**
     * Creates, catalogs and returns an [[EventListener]].
     *
     * Event listener can be disposed.
     *
     * @param once         Listener's once setting
     * @param type         Listener's type
     * @param callback     Callback function
     * @param context      Callback context
     * @param shouldClone  Whether the listener should be copied when the EventDispatcher is copied
     * @param dispatch
     * @returns An event listener
     */
    _on(once, type, callback, context, shouldClone, dispatch) {
        if (this._disposed) {
            throw new Error("EventDispatcher is disposed");
        }
        this._removeExistingListener(once, type, callback, context);
        const info = {
            type: type,
            callback: callback,
            context: context,
            shouldClone: shouldClone,
            dispatch: dispatch,
            killed: false,
            once: once,
            disposer: new Disposer(() => {
                info.killed = true;
                this._removeListener(info);
            })
        };
        this._listeners.push(info);
        return info;
    }
    /**
     * Creates an event listener to be invoked on **any** event.
     *
     * @param callback     Callback function
     * @param context      Callback context
     * @param shouldClone  Whether the listener should be copied when the EventDispatcher is copied
     * @returns A disposable event listener
     */
    onAll(callback, context, shouldClone = true) {
        return this._on(false, null, callback, context, shouldClone, (_type, event) => callback.call(context, event)).disposer;
    }
    /**
     * Creates an event listener to be invoked on a specific event type.
     *
     * ```TypeScript
     * button.events.once("click", (ev) => {
     *   console.log("Button clicked");
     * }, this);
     * ```
     * ```JavaScript
     * button.events.once("click", (ev) => {
     *   console.log("Button clicked");
     * }, this);
     * ```
     *
     * The above will invoke our custom event handler whenever series we put
     * event on is hidden.
     *
     * @param type         Listener's type
     * @param callback     Callback function
     * @param context      Callback context
     * @param shouldClone  Whether the listener should be copied when the EventDispatcher is copied
     * @returns A disposable event listener
     */
    on(type, callback, context, shouldClone = true) {
        return this._on(false, type, callback, context, shouldClone, (_type, event) => callback.call(context, event)).disposer;
    }
    /**
     * Creates an event listener to be invoked on a specific event type once.
     *
     * Once the event listener is invoked, it is automatically disposed.
     *
     * ```TypeScript
     * button.events.once("click", (ev) => {
     *   console.log("Button clicked");
     * }, this);
     * ```
     * ```JavaScript
     * button.events.once("click", (ev) => {
     *   console.log("Button clicked");
     * }, this);
     * ```
     *
     * The above will invoke our custom event handler the first time series we
     * put event on is hidden.
     *
     * @param type         Listener's type
     * @param callback     Callback function
     * @param context      Callback context
     * @param shouldClone  Whether the listener should be copied when the EventDispatcher is copied
     * @returns A disposable event listener
     */
    once(type, callback, context, shouldClone = true) {
        const x = this._on(true, type, callback, context, shouldClone, (_type, event) => {
            x.disposer.dispose();
            callback.call(context, event);
        });
        // TODO maybe this should return a different Disposer ?
        return x.disposer;
    }
    /**
     * Removes the event listener with specific parameters.
     *
     * @param type         Listener's type
     * @param callback     Callback function
     * @param context      Callback context
     */
    off(type, callback, context) {
        this._removeExistingListener(false, type, callback, context);
    }
    /**
     * Copies all dispatcher parameters, including listeners, from another event
     * dispatcher.
     *
     * @param source Source event dispatcher
     * @ignore
     */
    copyFrom(source) {
        if (this._disposed) {
            throw new Error("EventDispatcher is disposed");
        }
        if (source === this) {
            throw new Error("Cannot copyFrom the same TargetedEventDispatcher");
        }
        const disposers = [];
        $array.each(source._listeners, (x) => {
            // TODO is this correct ?
            if (!x.killed && x.shouldClone) {
                if (x.type === null) {
                    disposers.push(this.onAll(x.callback, x.context));
                }
                else if (x.once) {
                    disposers.push(this.once(x.type, x.callback, x.context));
                }
                else {
                    disposers.push(this.on(x.type, x.callback, x.context));
                }
            }
        });
        return new MultiDisposer(disposers);
    }
}
/**
 * A version of the [[EventDispatcher]] that dispatches events for a specific
 * target object.
 *
 * @ignore
 */
export class TargetedEventDispatcher extends EventDispatcher {
    /**
     * Constructor
     *
     * @param target Event dispatcher target
     */
    constructor(target) {
        super();
        /**
         * A target object which is originating events using this dispatcher.
         */
        Object.defineProperty(this, "target", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.target = target;
    }
    /**
     * Copies all dispatcher parameters, including listeners, from another event
     * dispatcher.
     *
     * @param source Source event dispatcher
     * @ignore
     */
    copyFrom(source) {
        if (this._disposed) {
            throw new Error("EventDispatcher is disposed");
        }
        if (source === this) {
            throw new Error("Cannot copyFrom the same TargetedEventDispatcher");
        }
        const disposers = [];
        $array.each(source._listeners, (x) => {
            // TODO very hacky
            if (x.context === source.target) {
                return;
            }
            // TODO is this correct ?
            if (!x.killed && x.shouldClone) {
                if (x.type === null) {
                    disposers.push(this.onAll(x.callback, x.context));
                }
                else if (x.once) {
                    disposers.push(this.once(x.type, x.callback, x.context));
                }
                else {
                    disposers.push(this.on(x.type, x.callback, x.context));
                }
            }
        });
        return new MultiDisposer(disposers);
    }
}
//# sourceMappingURL=EventDispatcher.js.map