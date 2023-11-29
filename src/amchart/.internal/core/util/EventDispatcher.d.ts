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
import { IDisposer } from "./Disposer";
/**
 * @ignore
 */
export declare type Events<Target, T> = {
    [K in keyof T]: T[K] & {
        type: K;
        target: Target;
    };
};
/**
 * A universal interface for event listeners.
 *
 * @ignore
 */
export interface EventListener {
    killed: boolean;
    once: boolean;
    type: any | null;
    callback: (event: any) => void;
    context: unknown;
    shouldClone: boolean;
    dispatch: (type: any, event: any) => void;
    disposer: IDisposer;
}
/**
 * Universal Event Dispatcher.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/events/} for more info
 */
export declare class EventDispatcher<T> implements IDisposer {
    protected _listeners: Array<EventListener>;
    protected _killed: Array<EventListener>;
    protected _disabled: {
        [key in keyof T]?: number;
    };
    protected _iterating: number;
    protected _enabled: boolean;
    protected _disposed: boolean;
    /**
     * Constructor
     */
    constructor();
    /**
     * Returns if this object has been already disposed.
     *
     * @return Disposed?
     */
    isDisposed(): boolean;
    /**
     * Dispose (destroy) this object.
     */
    dispose(): void;
    /**
     * Checks if this particular event dispatcher has any listeners set.
     *
     * @return Has listeners?
     */
    hasListeners(): boolean;
    /**
     * Checks if this particular event dispatcher has any particular listeners set.
     *
     * @return Has particular event listeners?
     */
    hasListenersByType<Key extends keyof T>(type: Key): boolean;
    /**
     * Enable dispatching of events if they were previously disabled by
     * `disable()`.
     */
    enable(): void;
    /**
     * Disable dispatching of events until re-enabled by `enable()`.
     */
    disable(): void;
    /**
     * Enable dispatching particular event, if it was disabled before by
     * `disableType()`.
     *
     * @param type Event type
     */
    enableType<Key extends keyof T>(type: Key): void;
    /**
     * Disable dispatching of events for a certain event type.
     *
     * Optionally, can set how many dispatches to skip before automatically
     * re-enabling the dispatching.
     *
     * @param type    Event type
     * @param amount  Number of event dispatches to skip
     */
    disableType<Key extends keyof T>(type: Key, amount?: number): void;
    /**
     * Removes listener from dispatcher.
     *
     * Will throw an exception if such listener does not exists.
     *
     * @param listener Listener to remove
     */
    protected _removeListener(listener: EventListener): void;
    /**
     * Removes existing listener by certain parameters.
     *
     * @param once         Listener's once setting
     * @param type         Listener's type
     * @param callback     Callback function
     * @param context      Callback context
     */
    protected _removeExistingListener<C, Key extends keyof T>(once: boolean, type: Key | null, callback?: (this: C, event: T[Key]) => void, context?: C): void;
    /**
     * Checks if dispatching for particular event type is enabled.
     *
     * @param type  Event type
     * @return Enabled?
     */
    isEnabled<Key extends keyof T>(type: Key): boolean;
    /**
     * Removes all listeners of a particular event type
     *
     * @param type  Listener's type
     */
    removeType<Key extends keyof T>(type: Key): void;
    /**
     * Checks if there's already a listener with specific parameters.
     *
     * @param type      Listener's type
     * @param callback  Callback function
     * @param context   Callback context
     * @return Has listener?
     */
    has<C, Key extends keyof T>(type: Key, callback?: (this: C, event: T[Key]) => void, context?: C): boolean;
    /**
     * Checks whether event of the particular type should be dispatched.
     *
     * @param type  Event type
     * @return Dispatch?
     */
    protected _shouldDispatch<Key extends keyof T>(type: Key): boolean;
    /**
     * [_eachListener description]
     *
     * All of this extra code is needed when a listener is removed while iterating
     *
     * @todo Description
     * @param fn [description]
     */
    protected _eachListener(fn: (listener: EventListener) => void): void;
    /**
     * Dispatches an event immediately without waiting for next cycle.
     *
     * @param type   Event type
     * @param event  Event object
     * @todo automatically add in type and target properties if they are missing
     */
    dispatch<Key extends keyof T>(type: Key, event: T[Key]): void;
    /**
     * Shelves the event to be dispatched within next update cycle.
     *
     * @param type   Event type
     * @param event  Event object
     * @todo automatically add in type and target properties if they are missing
     */
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
    protected _on<C, Key extends keyof T>(once: boolean, type: Key | null, callback: any, context: C, shouldClone: boolean, dispatch: (type: Key, event: T[Key]) => void): EventListener;
    /**
     * Creates an event listener to be invoked on **any** event.
     *
     * @param callback     Callback function
     * @param context      Callback context
     * @param shouldClone  Whether the listener should be copied when the EventDispatcher is copied
     * @returns A disposable event listener
     */
    onAll<C, K extends keyof T>(callback: (this: C, event: T[K]) => void, context?: C, shouldClone?: boolean): IDisposer;
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
    on<C, Key extends keyof T>(type: Key, callback: (this: C | undefined, event: T[Key]) => void, context?: C, shouldClone?: boolean): IDisposer;
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
    once<C, Key extends keyof T>(type: Key, callback: (this: C | undefined, event: T[Key]) => void, context?: C, shouldClone?: boolean): IDisposer;
    /**
     * Removes the event listener with specific parameters.
     *
     * @param type         Listener's type
     * @param callback     Callback function
     * @param context      Callback context
     */
    off<C, Key extends keyof T>(type: Key, callback?: (this: C, event: T[Key]) => void, context?: C): void;
    /**
     * Copies all dispatcher parameters, including listeners, from another event
     * dispatcher.
     *
     * @param source Source event dispatcher
     * @ignore
     */
    copyFrom(source: this): IDisposer;
}
/**
 * A version of the [[EventDispatcher]] that dispatches events for a specific
 * target object.
 *
 * @ignore
 */
export declare class TargetedEventDispatcher<Target, T> extends EventDispatcher<T> {
    /**
     * A target object which is originating events using this dispatcher.
     */
    target: Target;
    /**
     * Constructor
     *
     * @param target Event dispatcher target
     */
    constructor(target: Target);
    /**
     * Copies all dispatcher parameters, including listeners, from another event
     * dispatcher.
     *
     * @param source Source event dispatcher
     * @ignore
     */
    copyFrom(source: this): IDisposer;
}
//# sourceMappingURL=EventDispatcher.d.ts.map