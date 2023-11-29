import type { Root } from "../Root";
import type { Template, ApplyState } from "./Template";
import type { Theme } from "../Theme";
import type { ILocale } from "./Language";
import { IDisposer } from "./Disposer";
import { EventDispatcher, Events } from "./EventDispatcher";
import { Time, IAnimation } from "./Animation";
import { States } from "./States";
import * as $ease from "./Ease";
/**
 * @ignore
 */
export declare type Dirty<A> = {
    [K in keyof A]?: boolean;
};
/**
 * Allows to dynamically modify setting value of its target element.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/adapters/} for more info
 */
export declare class Adapters<E extends Settings> {
    private _entity;
    private _callbacks;
    private _disabled;
    constructor(entity: E);
    /**
     * Add a function (`callback`) that will modify value for setting `key`.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/adapters/} for more info
     */
    add<Key extends keyof E["_settings"]>(key: Key, callback: (value: E["_settings"][Key], target: E, key: Key) => E["_settings"][Key]): IDisposer;
    /**
     * Removes all adapters for the specific key.
     *
     * @since 5.1.0
     */
    remove<Key extends keyof E["_settings"]>(key: Key): void;
    /**
     * Enables (previously disabled) adapters for specific key.
     *
     * @since 5.1.0
     */
    enable<Key extends keyof E["_settings"]>(key: Key): void;
    /**
     * Disables all adapters for specific key.
     *
     * @since 5.1.0
     */
    disable<Key extends keyof E["_settings"]>(key: Key): void;
    /**
     * @ignore
     */
    fold<Key extends keyof E["_settings"]>(key: Key, value: E["_settings"][Key]): E["_settings"][Key];
}
export interface IEntitySettings {
    /**
     * Tags which can be used by the theme rules.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/themes/} for more info
     */
    themeTags?: Array<string>;
    /**
     * Tags which can be used by the theme rules.
     *
     * These tags only apply to this object, not any children.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/themes/} for more info
     */
    themeTagsSelf?: Array<string>;
    /**
     * A list of themes applied to the element.
     */
    themes?: Array<Theme>;
    /**
     * Duration of transition from one state to another.
     */
    stateAnimationDuration?: number;
    /**
     * Easing of transition from one state to another.
     */
    stateAnimationEasing?: $ease.Easing;
    /**
     * A custom string ID for the element.
     *
     * If set, element can be looked up via `am5.registry.entitiesById`.
     *
     * Will raise error if an element with the same ID already exists.
     */
    id?: string;
    /**
     * A storage for any custom user data that needs to be associated with the
     * element.
     */
    userData?: any;
}
export interface IEntityPrivate {
}
export interface IEntityEvents {
}
/**
 * Animation options.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/animations/} for more info
 */
export interface AnimationOptions<Key, Value> {
    /**
     * A setting key to animate value for.
     */
    key: Key;
    /**
     * Initial value to animate from. If not set, will use current value.
     */
    from?: Value;
    /**
     * Target value to animate to.
     */
    to: Value;
    /**
     * Animation duration in milliseconds.
     */
    duration: number;
    /**
     * Easing function. Defaults to linear.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/animations/#Easing_functions} for more info
     */
    easing?: $ease.Easing;
    /**
     * How many times to play the animation. Defaults to 1.
     */
    loops?: number;
}
export interface IAnimationEvents {
    /**
     * Invoked when animation was stopped, which happens in these situations:
     * 1. When the animation reached the end.
     * 2. When the `stop()` method is called.
     * 3. When a new animation starts for the same key.
     * 4. When calling `set` for the same key.
     */
    stopped: {};
}
/**
 * Animation object.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/animations/} for more info
 */
export declare class Animation<Value> {
    private _animation;
    private _from;
    private _to;
    private _duration;
    private _easing;
    private _loops;
    private _interpolate;
    private _oldTime;
    private _time;
    _stopped: boolean;
    _playing: boolean;
    events: EventDispatcher<Events<this, IAnimationEvents>>;
    constructor(animation: IStartAnimation, from: Value, to: Value, duration: number, easing: $ease.Easing, loops: number, startingTime: number | null);
    get to(): Value;
    get from(): Value;
    get playing(): boolean;
    get stopped(): boolean;
    stop(): void;
    pause(): void;
    play(): void;
    get percentage(): Time;
    waitForStop(): Promise<void>;
    _checkEnded(): boolean;
    _run(currentTime: number): void;
    _reset(currentTime: number): void;
    _value(diff: Time): Value;
}
declare type Animated<P> = {
    [K in keyof P]?: Animation<P[K]>;
};
interface IStartAnimation {
    _startAnimation(): void;
}
/**
 * Base class for [[Entity]] objects that support Settings.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/} for more info
 */
export declare abstract class Settings implements IDisposer, IAnimation, IStartAnimation {
    /**
     * Unique ID.
     */
    uid: number;
    _settings: {};
    _privateSettings: {};
    _settingEvents: {
        [K in keyof this["_settings"]]?: Array<(<V extends this["_settings"][K], O extends this>(value: V, target?: O, key?: K) => void)>;
    };
    _privateSettingEvents: {
        [K in keyof this["_settings"]]?: Array<(<V extends this["_settings"][K], O extends this>(value: V, target?: O, key?: K) => void)>;
    };
    _prevSettings: this["_settings"];
    _prevPrivateSettings: this["_privateSettings"];
    protected _animatingSettings: Animated<this["_settings"]>;
    protected _animatingPrivateSettings: Animated<this["_privateSettings"]>;
    private _playingAnimations;
    private _disposed;
    protected _userProperties: Dirty<this["_settings"]>;
    constructor(settings: Settings["_settings"]);
    protected _checkDirty(): void;
    /**
     * @ignore
     */
    resetUserSettings(): void;
    /**
     * @ignore
     */
    abstract markDirty(): void;
    _runAnimation(currentTime: number): boolean;
    abstract _startAnimation(): void;
    protected abstract _animationTime(): number | null;
    _markDirtyKey<Key extends keyof this["_settings"]>(_key: Key): void;
    _markDirtyPrivateKey<Key extends keyof this["_privateSettings"]>(_key: Key): void;
    /**
     * Sets a callback function to invoke when specific key of settings changes
     * or is set.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/events/#Settings_value_change} for more info
     * @param   key       Settings key
     * @param   callback  Callback
     * @return            Disposer for event
     */
    on<Key extends keyof this["_settings"]>(key: Key, callback: (value: this["_settings"][Key], target?: this, key?: Key) => void): IDisposer;
    /**
     * Sets a callback function to invoke when specific key of private settings
     * changes or is set.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/events/#Settings_value_change} for more info
     * @ignore
     * @param   key       Private settings key
     * @param   callback  Callback
     * @return            Disposer for event
     */
    onPrivate<Key extends keyof this["_privateSettings"]>(key: Key, callback: (value: this["_privateSettings"][Key], target?: this, key?: Key) => void): IDisposer;
    /**
     * @ignore
     */
    getRaw<Key extends keyof this["_settings"], F>(key: Key, fallback: F): NonNullable<this["_settings"][Key]> | F;
    /**
     * @ignore
     */
    getRaw<Key extends keyof this["_settings"]>(key: Key): this["_settings"][Key];
    /**
     * Returns settings value for the specified `key`.
     *
     * If there is no value, `fallback` is returned instead (if set).
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/} for more info
     * @param   key       Settings value
     * @param   callback  Fallback value
     * @return  {any}     Value
     */
    get<Key extends keyof this["_settings"], F>(key: Key, fallback: F): NonNullable<this["_settings"][Key]> | F;
    get<Key extends keyof this["_settings"]>(key: Key): this["_settings"][Key];
    protected _sendKeyEvent<Key extends keyof this["_settings"], Value extends this["_settings"][Key]>(key: Key, value: Value): void;
    protected _sendPrivateKeyEvent<Key extends keyof this["_settings"], Value extends this["_settings"][Key]>(key: Key, value: Value): void;
    /**
     * @ignore
     */
    private _setRaw;
    /**
     * @ignore
     */
    setRaw<Key extends keyof this["_settings"], Value extends this["_settings"][Key]>(key: Key, value: Value): void;
    /**
     * @ignore
     */
    private _set;
    protected _stopAnimation<Key extends keyof this["_settings"]>(key: Key): void;
    /**
     * Sets a setting `value` for the specified `key`, and returns the same `value`.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/} for more info
     * @param   key       Setting key
     * @param   value     Setting value
     * @return            Setting value
     */
    set<Key extends keyof this["_settings"], Value extends this["_settings"][Key]>(key: Key, value: Value): Value;
    /**
     * Removes a setting value for the specified `key`;
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/} for more info
     * @param   key       Setting key
     */
    remove<Key extends keyof this["_settings"]>(key: Key): void;
    /**
     * Removes all keys;
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/} for more info
     */
    removeAll(): void;
    /**
     * @ignore
     */
    getPrivate<Key extends keyof this["_privateSettings"], F>(key: Key, fallback: F): NonNullable<this["_privateSettings"][Key]> | F;
    /**
     * @ignore
     */
    getPrivate<Key extends keyof this["_privateSettings"]>(key: Key): this["_privateSettings"][Key];
    /**
     * @ignore
     */
    private _setPrivateRaw;
    /**
     * @ignore
     */
    setPrivateRaw<Key extends keyof this["_privateSettings"], Value extends this["_privateSettings"][Key]>(key: Key, value: Value): void;
    /**
     * @ignore
     */
    private _setPrivate;
    protected _stopAnimationPrivate<Key extends keyof this["_privateSettings"]>(key: Key): void;
    /**
     * @ignore
     */
    setPrivate<Key extends keyof this["_privateSettings"], Value extends this["_privateSettings"][Key]>(key: Key, value: Value): Value;
    /**
     * @ignore
     */
    removePrivate<Key extends keyof this["_privateSettings"]>(key: Key): void;
    /**
     * Sets multiple settings at once.
     *
     * `settings` must be an object with key: value pairs.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/} for more info
     * @param settings Settings
     */
    setAll(settings: Partial<this["_settings"]>): void;
    /**
     * Animates setting values from current/start values to new ones.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/animations/#Animating_settings} for more info
     * @param   options  Animation options
     * @return           Animation object
     */
    animate<Key extends keyof this["_settings"]>(options: AnimationOptions<Key, this["_settings"][Key]>): Animation<this["_settings"][Key]>;
    /**
     * @ignore
     */
    animatePrivate<Key extends keyof this["_privateSettings"]>(options: AnimationOptions<Key, this["_privateSettings"][Key]>): Animation<this["_privateSettings"][Key]>;
    protected _dispose(): void;
    /**
     * Returns `true` if this element is disposed.
     *
     * @return Disposed
     */
    isDisposed(): boolean;
    /**
     * Disposes this object.
     */
    dispose(): void;
}
/**
 * Base class.
 *
 * @important
 */
export declare class Entity extends Settings implements IDisposer {
    _root: Root;
    _user_id: any;
    _settings: IEntitySettings;
    _privateSettings: IEntityPrivate;
    _events: IEntityEvents;
    states: States<this>;
    adapters: Adapters<this>;
    events: EventDispatcher<Events<this, this["_events"]>>;
    protected _userPrivateProperties: Dirty<this["_privateSettings"]>;
    _dirty: Dirty<this["_settings"]>;
    _dirtyPrivate: Dirty<this["_privateSettings"]>;
    protected _template: Template<this> | undefined;
    protected _templates: Array<Template<this>>;
    protected _internalTemplates: Array<Template<this>>;
    _defaultThemes: Array<Theme>;
    protected _templateDisposers: Array<IDisposer>;
    protected _disposers: Array<IDisposer>;
    protected _runSetup: boolean;
    static className: string;
    static classNames: Array<string>;
    protected _disposerProperties: {
        [Key in keyof this["_settings"]]?: Array<IDisposer>;
    };
    /**
     * IMPORTANT! Do not instantiate this class via `new Class()` syntax.
     *
     * Use static method `Class.new()` instead.
     *
     * @see {@link https://www.amcharts.com/docs/v5/getting-started/#New_element_syntax} for more info
     * @ignore
     */
    constructor(root: Root, settings: Entity["_settings"], isReal: boolean, templates?: Array<Template<Entity>>);
    /**
     * Use this method to create an instance of this class.
     *
     * @see {@link https://www.amcharts.com/docs/v5/getting-started/#New_element_syntax} for more info
     * @param   root      Root element
     * @param   settings  Settings
     * @param   template  Template
     * @return            Instantiated object
     */
    static new<C extends typeof Entity, T extends InstanceType<C>>(this: C, root: Root, settings: T["_settings"], template?: Template<T>): T;
    static _new<C extends typeof Entity, T extends InstanceType<C>>(this: C, root: Root, settings: T["_settings"], templates?: Array<Template<T>>): T;
    protected _afterNew(): void;
    protected _afterNewApplyThemes(): void;
    protected _createEvents(): EventDispatcher<Events<this, this["_events"]>>;
    /**
     * @ignore
     */
    get classNames(): Array<string>;
    /**
     * @ignore
     */
    get className(): string;
    protected _setDefaults(): void;
    _setDefault<Key extends keyof this["_settings"]>(key: Key, value: this["_settings"][Key]): void;
    _setRawDefault<Key extends keyof this["_settings"]>(key: Key, value: this["_settings"][Key]): void;
    _clearDirty(): void;
    /**
     * @ignore
     */
    isDirty<Key extends keyof this["_settings"]>(key: Key): boolean;
    /**
     * @ignore
     */
    isPrivateDirty<Key extends keyof this["_privateSettings"]>(key: Key): boolean;
    _markDirtyKey<Key extends keyof this["_settings"]>(key: Key): void;
    _markDirtyPrivateKey<Key extends keyof this["_privateSettings"]>(key: Key): void;
    /**
     * Checks if element is of certain class (or inherits one).
     *
     * @param   type  Class name to check
     * @return {boolean} Is of class?
     */
    isType<A>(type: string): this is A;
    protected _pushPropertyDisposer<Key extends keyof this["_settings"], D extends IDisposer>(key: Key, disposer: D): D;
    protected _disposeProperty<Key extends keyof this["_settings"]>(key: Key): void;
    /**
     * @todo needs description
     * @param  value  Template
     */
    set template(value: Template<this> | undefined);
    get template(): Template<this> | undefined;
    /**
     * @ignore
     */
    markDirty(): void;
    _startAnimation(): void;
    protected _animationTime(): number | null;
    _applyState(_name: string): void;
    _applyStateAnimated(_name: string, _duration?: number): void;
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
    get<Key extends keyof this["_settings"], F>(key: Key, fallback: F): NonNullable<this["_settings"][Key]> | F;
    get<Key extends keyof this["_settings"]>(key: Key): this["_settings"][Key];
    /**
     * @ignore
     */
    isUserSetting<Key extends keyof this["_settings"]>(key: Key): boolean;
    /**
     * Sets a setting `value` for the specified `key`, and returns the same `value`.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/} for more info
     * @param   key       Setting key
     * @param   value     Setting value
     * @return            Setting value
     */
    set<Key extends keyof this["_settings"], Value extends this["_settings"][Key]>(key: Key, value: Value): Value;
    /**
     * @ignore
     */
    setRaw<Key extends keyof this["_settings"], Value extends this["_settings"][Key]>(key: Key, value: Value): void;
    /**
     * Sets a setting `value` for the specified `key` only if the value for this key was not set previously using set method, and returns the same `value`.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/} for more info
     * @param   key       Setting key
     * @param   value     Setting value
     * @return            Setting value
     */
    _setSoft<Key extends keyof this["_settings"], Value extends this["_settings"][Key]>(key: Key, value: Value): Value;
    /**
     * Removes a setting value for the specified `key`.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/} for more info
     * @param   key       Setting key
     */
    remove<Key extends keyof this["_settings"]>(key: Key): void;
    /**
     * @ignore
     */
    setPrivate<Key extends keyof this["_privateSettings"], Value extends this["_privateSettings"][Key]>(key: Key, value: Value): Value;
    /**
     * @ignore
     */
    setPrivateRaw<Key extends keyof this["_privateSettings"], Value extends this["_privateSettings"][Key]>(key: Key, value: Value): void;
    /**
     * @ignore
     */
    removePrivate<Key extends keyof this["_privateSettings"]>(key: Key): void;
    _setTemplateProperty<Key extends keyof this["_settings"]>(template: Template<this>, key: Key, value: this["_settings"][Key]): void;
    _setTemplatePrivateProperty<Key extends keyof this["_privateSettings"]>(template: Template<this>, key: Key, value: this["_privateSettings"][Key]): void;
    _removeTemplateProperty<Key extends keyof this["_settings"]>(key: Key): void;
    _removeTemplatePrivateProperty<Key extends keyof this["_privateSettings"]>(key: Key): void;
    _walkParents(f: (parent: Entity) => void): void;
    _applyStateByKey(name: string): void;
    protected _applyTemplate(template: Template<this>, state: ApplyState<this>): void;
    /**
     * Calls the closure with each template and returns the first template which is true
     */
    protected _findStaticTemplate(f: (template: Template<this>) => boolean): Template<this> | undefined;
    _eachTemplate(f: (template: Template<this>) => void): void;
    _applyTemplates(remove?: boolean): void;
    protected _findTemplate(f: (template: Template<this>) => boolean): Template<this> | undefined;
    protected _findTemplateByKey<Key extends keyof this["_settings"]>(key: Key): Template<this> | undefined;
    protected _findTemplateByPrivateKey<Key extends keyof this["_privateSettings"]>(key: Key): Template<this> | undefined;
    protected _disposeTemplates(): void;
    protected _removeTemplates(): void;
    _applyThemes(force?: boolean): boolean;
    _changed(): void;
    _beforeChanged(): void;
    private _registerId;
    _afterChanged(): void;
    /**
     * @ignore
     */
    addDisposer<T extends IDisposer>(disposer: T): T;
    protected _dispose(): void;
    /**
     * Creates and returns a "disposable" timeout.
     *
     * @param   fn     Callback
     * @param   delay  Delay in milliseconds
     * @return         Timeout disposer
     */
    setTimeout(fn: () => void, delay: number): IDisposer;
    /**
     * @ignore
     */
    removeDispose(target: IDisposer): void;
    /**
     * @ignore
     */
    hasTag(tag: string): boolean;
    /**
     * @ignore
     */
    addTag(tag: string): void;
    /**
     * @ignore
     */
    removeTag(tag: string): void;
    protected _t(text: any, locale?: ILocale, ...rest: Array<string>): string;
    /**
     * An instance of [[Root]] object.
     *
     * @readonly
     * @since 5.0.6
     * @return Root object
     */
    get root(): Root;
}
export {};
//# sourceMappingURL=Entity.d.ts.map