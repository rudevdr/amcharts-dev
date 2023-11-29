import type { Entity, Dirty } from "./Entity";
import type { Animations } from "./Animation";
/**
 * An object representing a collection of setting values to apply as required.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/states/} for more info
 */
export declare class State<E extends Entity> {
    private _entity;
    _settings: Partial<E["_settings"]>;
    _userSettings: Dirty<E["_settings"]>;
    constructor(entity: E, settings: Partial<E["_settings"]>);
    /**
     * Returns settings value for the specified `key`.
     *
     * If there is no value, `fallback` is returned instead (if set).
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/} for more info
     * @param   key       Settings value
     * @param   callback  Fallback value
     * @return            Value
     */
    get<Key extends keyof this["_settings"]>(key: Key): this["_settings"][Key];
    get<Key extends keyof this["_settings"], F>(key: Key, fallback: F): NonNullable<this["_settings"][Key]> | F;
    /**
     * @ignore
     */
    setRaw<Key extends keyof E["_settings"]>(key: Key, value: E["_settings"][Key]): void;
    /**
     * Sets a setting `value` for the specified `key` to be set when the state
     * is applied.
     *
     * @param   key       Setting key
     * @param   value     Setting value
     * @return            Setting value
     */
    set<Key extends keyof E["_settings"]>(key: Key, value: E["_settings"][Key]): void;
    /**
     * Removes a setting value for the specified `key`.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/} for more info
     * @param   key       Setting key
     */
    remove<Key extends keyof this["_settings"]>(key: Key): void;
    /**
     * Sets multiple settings at once.
     *
     * `settings` must be an object with key: value pairs.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/} for more info
     * @param settings Settings
     */
    setAll(settings: this["_settings"]): void;
    private _eachSetting;
    /**
     * Applies the state to the target element.
     *
     * All setting values are set immediately.
     */
    apply(): void;
    /**
     * Applies the state to the target element.
     *
     * Returns an object representing all [[Animation]] objects created for
     * each setting key transition.
     *
     * @return           Animations
     */
    applyAnimate(duration?: number): Animations<E["_settings"]>;
}
/**
 * Collection of [[State]] objects for an element.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/states/} for more info
 */
export declare class States<E extends Entity> {
    private _states;
    private _entity;
    constructor(entity: E);
    /**
     * Checks if a state by `name` exists. Returns it there is one.
     *
     * @param  name  State name
     * @return       State
     */
    lookup(name: string): State<E> | undefined;
    /**
     * Sets supplied `settings` on a state by the `name`.
     *
     * If such state does not yet exists, it is created.
     *
     * @param   name      State name
     * @param   settings  Settings
     * @return            New State
     */
    create(name: string, settings: Partial<E["_settings"]>): State<E>;
    /**
     * Removes the state called `name`.
     *
     * @param   name      State name
     */
    remove(name: string): void;
    /**
     * Applies a named state to the target element.
     *
     * @param  newState  State name
     */
    apply(newState: string): void;
    /**
     * Applies a named state to the element.
     *
     * Returns an object representing all [[Animation]] objects created for
     * each setting key transition.
     *
     * @param   newState  State name
     * @return            Animations
     */
    applyAnimate(newState: string, duration?: number): Animations<E["_settings"]> | undefined;
}
//# sourceMappingURL=States.d.ts.map