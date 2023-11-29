import { Disposer } from "./Disposer";
import { EventDispatcher } from "./EventDispatcher";
import { getInterpolate } from "./Animation";
import { States } from "./States";
import { registry } from "../Registry";
import * as $object from "./Object";
import * as $ease from "./Ease";
import * as $array from "./Array";
import * as $order from "./Order";
/**
 * Allows to dynamically modify setting value of its target element.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/adapters/} for more info
 */
export class Adapters {
    constructor(entity) {
        Object.defineProperty(this, "_entity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_callbacks", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_disabled", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        this._entity = entity;
    }
    /**
     * Add a function (`callback`) that will modify value for setting `key`.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/adapters/} for more info
     */
    add(key, callback) {
        let callbacks = this._callbacks[key];
        if (callbacks === undefined) {
            callbacks = this._callbacks[key] = [];
        }
        callbacks.push(callback);
        this._entity._markDirtyKey(key);
        return new Disposer(() => {
            if ($array.removeFirst(callbacks, callback)) {
                this._entity._markDirtyKey(key);
            }
        });
    }
    /**
     * Removes all adapters for the specific key.
     *
     * @since 5.1.0
     */
    remove(key) {
        const callbacks = this._callbacks[key];
        if (callbacks !== undefined) {
            delete this._callbacks[key];
            if (callbacks.length !== 0) {
                this._entity._markDirtyKey(key);
            }
        }
    }
    /**
     * Enables (previously disabled) adapters for specific key.
     *
     * @since 5.1.0
     */
    enable(key) {
        if (this._disabled[key]) {
            delete this._disabled[key];
            this._entity._markDirtyKey(key);
        }
    }
    /**
     * Disables all adapters for specific key.
     *
     * @since 5.1.0
     */
    disable(key) {
        if (!this._disabled[key]) {
            this._disabled[key] = true;
            this._entity._markDirtyKey(key);
        }
    }
    /**
     * @ignore
     */
    fold(key, value) {
        if (!this._disabled[key]) {
            const callbacks = this._callbacks[key];
            if (callbacks !== undefined) {
                for (let i = 0, len = callbacks.length; i < len; ++i) {
                    value = callbacks[i](value, this._entity, key);
                }
            }
        }
        return value;
    }
}
/**
 * Animation object.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/animations/} for more info
 */
export class Animation {
    constructor(animation, from, to, duration, easing, loops, startingTime) {
        Object.defineProperty(this, "_animation", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_from", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_to", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_duration", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_easing", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_loops", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_interpolate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_oldTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_time", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_stopped", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_playing", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "events", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new EventDispatcher()
        });
        this._animation = animation;
        this._from = from;
        this._to = to;
        this._duration = duration;
        this._easing = easing;
        this._loops = loops;
        this._interpolate = getInterpolate(from, to);
        this._oldTime = startingTime;
    }
    get to() {
        return this._to;
    }
    get from() {
        return this._from;
    }
    get playing() {
        return this._playing;
    }
    get stopped() {
        return this._stopped;
    }
    stop() {
        if (!this._stopped) {
            this._stopped = true;
            this._playing = false;
            if (this.events.isEnabled("stopped")) {
                this.events.dispatch("stopped", {
                    type: "stopped",
                    target: this,
                });
            }
        }
    }
    pause() {
        this._playing = false;
        this._oldTime = null;
    }
    play() {
        if (!this._stopped && !this._playing) {
            this._playing = true;
            this._animation._startAnimation();
        }
    }
    get percentage() {
        return this._time / this._duration;
    }
    waitForStop() {
        return new Promise((resolve, _reject) => {
            if (this._stopped) {
                resolve();
            }
            else {
                const listener = () => {
                    stopped.dispose();
                    resolve();
                };
                const stopped = this.events.on("stopped", listener);
            }
        });
    }
    _checkEnded() {
        if (this._loops > 1) {
            --this._loops;
            return false;
        }
        else {
            return true;
        }
    }
    _run(currentTime) {
        if (this._oldTime !== null) {
            this._time += currentTime - this._oldTime;
            if (this._time > this._duration) {
                this._time = this._duration;
            }
        }
        this._oldTime = currentTime;
    }
    _reset(currentTime) {
        this._oldTime = currentTime;
        this._time = 0;
    }
    _value(diff) {
        return this._interpolate(this._easing(diff), this._from, this._to);
    }
}
/**
 * @ignore
 */
let counter = 0;
/**
 * Base class for [[Entity]] objects that support Settings.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/} for more info
 */
export class Settings {
    constructor(settings) {
        /**
         * Unique ID.
         */
        Object.defineProperty(this, "uid", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ++counter
        });
        Object.defineProperty(this, "_settings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_privateSettings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_settingEvents", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_privateSettingEvents", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_prevSettings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_prevPrivateSettings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_animatingSettings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_animatingPrivateSettings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_playingAnimations", {
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
        // TODO move this into Entity
        Object.defineProperty(this, "_userProperties", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        this._settings = settings;
    }
    _checkDirty() {
        $object.keys(this._settings).forEach((key) => {
            this._userProperties[key] = true;
            this._markDirtyKey(key);
        });
    }
    /**
     * @ignore
     */
    resetUserSettings() {
        this._userProperties = {};
    }
    _runAnimation(currentTime) {
        if (!this.isDisposed()) {
            $object.each(this._animatingSettings, (key, animation) => {
                if (animation._stopped) {
                    this._stopAnimation(key);
                }
                else if (animation._playing) {
                    animation._run(currentTime);
                    const diff = animation.percentage;
                    if (diff >= 1) {
                        if (animation._checkEnded()) {
                            this.set(key, animation._value(1));
                        }
                        else {
                            animation._reset(currentTime);
                            this._set(key, animation._value(1));
                        }
                    }
                    else {
                        this._set(key, animation._value(diff));
                    }
                }
            });
            $object.each(this._animatingPrivateSettings, (key, animation) => {
                if (animation._stopped) {
                    this._stopAnimationPrivate(key);
                }
                else if (animation._playing) {
                    animation._run(currentTime);
                    const diff = animation.percentage;
                    if (diff >= 1) {
                        if (animation._checkEnded()) {
                            this.setPrivate(key, animation._value(1));
                        }
                        else {
                            animation._reset(currentTime);
                            this._setPrivate(key, animation._value(1));
                        }
                    }
                    else {
                        this._setPrivate(key, animation._value(diff));
                    }
                }
            });
            return this._playingAnimations !== 0;
        }
        else {
            return false;
        }
    }
    _markDirtyKey(_key) {
        this.markDirty();
    }
    _markDirtyPrivateKey(_key) {
        this.markDirty();
    }
    /**
     * Sets a callback function to invoke when specific key of settings changes
     * or is set.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/events/#Settings_value_change} for more info
     * @param   key       Settings key
     * @param   callback  Callback
     * @return            Disposer for event
     */
    on(key, callback) {
        let events = this._settingEvents[key];
        if (events === undefined) {
            events = this._settingEvents[key] = [];
        }
        events.push(callback);
        return new Disposer(() => {
            $array.removeFirst(events, callback);
            if (events.length === 0) {
                delete this._settingEvents[key];
            }
        });
    }
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
    onPrivate(key, callback) {
        let events = this._privateSettingEvents[key];
        if (events === undefined) {
            events = this._privateSettingEvents[key] = [];
        }
        events.push(callback);
        return new Disposer(() => {
            $array.removeFirst(events, callback);
            if (events.length === 0) {
                delete this._privateSettingEvents[key];
            }
        });
    }
    /**
     * @ignore
     */
    getRaw(key, fallback) {
        const value = this._settings[key];
        if (value !== undefined) {
            return value;
        }
        else {
            return fallback;
        }
    }
    get(key, fallback) {
        return this.getRaw(key, fallback);
    }
    _sendKeyEvent(key, value) {
        const events = this._settingEvents[key];
        if (events !== undefined) {
            $array.each(events, (callback) => {
                callback(value, this, key);
            });
        }
    }
    _sendPrivateKeyEvent(key, value) {
        const events = this._privateSettingEvents[key];
        if (events !== undefined) {
            $array.each(events, (callback) => {
                callback(value, this, key);
            });
        }
    }
    /**
     * @ignore
     */
    _setRaw(key, old, value) {
        this._prevSettings[key] = old;
        this._sendKeyEvent(key, value);
    }
    /**
     * @ignore
     */
    setRaw(key, value) {
        const old = this._settings[key];
        this._settings[key] = value;
        if (old !== value) {
            this._setRaw(key, old, value);
        }
    }
    /**
     * @ignore
     */
    _set(key, value) {
        const old = this._settings[key];
        this._settings[key] = value;
        if (old !== value) {
            this._setRaw(key, old, value);
            this._markDirtyKey(key);
        }
    }
    _stopAnimation(key) {
        const animation = this._animatingSettings[key];
        if (animation) {
            --this._playingAnimations;
            delete this._animatingSettings[key];
            animation.stop();
        }
    }
    /**
     * Sets a setting `value` for the specified `key`, and returns the same `value`.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/} for more info
     * @param   key       Setting key
     * @param   value     Setting value
     * @return            Setting value
     */
    set(key, value) {
        this._set(key, value);
        this._stopAnimation(key);
        return value;
    }
    /**
     * Removes a setting value for the specified `key`;
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/} for more info
     * @param   key       Setting key
     */
    remove(key) {
        if (key in this._settings) {
            this._prevSettings[key] = this._settings[key];
            delete this._settings[key];
            this._sendKeyEvent(key, undefined);
            this._markDirtyKey(key);
        }
        this._stopAnimation(key);
    }
    /**
     * Removes all keys;
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/} for more info
     */
    removeAll() {
        $array.each($object.keys(this._settings), (key) => {
            this.remove(key);
        });
    }
    /**
     * Returns a value of a private setting.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/#Private_settings} for more info
     */
    getPrivate(key, fallback) {
        const value = this._privateSettings[key];
        if (value !== undefined) {
            return value;
        }
        else {
            return fallback;
        }
    }
    /**
     * @ignore
     */
    _setPrivateRaw(key, old, value) {
        this._prevPrivateSettings[key] = old;
        this._sendPrivateKeyEvent(key, value);
    }
    /**
     * @ignore
     */
    setPrivateRaw(key, value) {
        const old = this._privateSettings[key];
        this._privateSettings[key] = value;
        if (old !== value) {
            this._setPrivateRaw(key, old, value);
        }
    }
    /**
     * @ignore
     */
    _setPrivate(key, value) {
        const old = this._privateSettings[key];
        this._privateSettings[key] = value;
        if (old !== value) {
            this._setPrivateRaw(key, old, value);
            this._markDirtyPrivateKey(key);
        }
    }
    _stopAnimationPrivate(key) {
        const animation = this._animatingPrivateSettings[key];
        if (animation) {
            --this._playingAnimations;
            animation.stop();
            delete this._animatingPrivateSettings[key];
        }
    }
    /**
     * @ignore
     */
    setPrivate(key, value) {
        this._setPrivate(key, value);
        this._stopAnimationPrivate(key);
        return value;
    }
    /**
     * @ignore
     */
    removePrivate(key) {
        if (key in this._privateSettings) {
            this._prevPrivateSettings[key] = this._privateSettings[key];
            delete this._privateSettings[key];
            this._markDirtyPrivateKey(key);
        }
        this._stopAnimationPrivate(key);
    }
    /**
     * Sets multiple settings at once.
     *
     * `settings` must be an object with key: value pairs.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/} for more info
     * @param settings Settings
     */
    setAll(settings) {
        $object.each(settings, (key, value) => {
            this.set(key, value);
        });
    }
    /**
     * Animates setting values from current/start values to new ones.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/animations/#Animating_settings} for more info
     * @param   options  Animation options
     * @return           Animation object
     */
    animate(options) {
        const key = options.key;
        const to = options.to;
        const duration = options.duration || 0;
        const loops = options.loops || 1;
        const from = (options.from === undefined ? this.get(key) : options.from);
        const easing = (options.easing === undefined ? $ease.linear : options.easing);
        if (duration === 0) {
            this.set(key, to);
        }
        else {
            if (from === undefined || from === to) {
                this.set(key, to);
            }
            else {
                this.set(key, from);
                const animation = this._animatingSettings[key] = new Animation(this, from, to, duration, easing, loops, this._animationTime());
                ++this._playingAnimations;
                this._startAnimation();
                return animation;
            }
        }
        const animation = new Animation(this, from, to, duration, easing, loops, null);
        animation.stop();
        return animation;
    }
    /**
     * @ignore
     */
    animatePrivate(options) {
        const key = options.key;
        const to = options.to;
        const duration = options.duration || 0;
        const loops = options.loops || 1;
        const from = (options.from === undefined ? this.getPrivate(key) : options.from);
        const easing = (options.easing === undefined ? $ease.linear : options.easing);
        if (duration === 0) {
            this.setPrivate(key, to);
        }
        else {
            if (from === undefined || from === to) {
                this.setPrivate(key, to);
            }
            else {
                this.setPrivate(key, from);
                const animation = this._animatingPrivateSettings[key] = new Animation(this, from, to, duration, easing, loops, this._animationTime());
                ++this._playingAnimations;
                this._startAnimation();
                return animation;
            }
        }
        const animation = new Animation(this, from, to, duration, easing, loops, null);
        animation.stop();
        return animation;
    }
    _dispose() { }
    /**
     * Returns `true` if this element is disposed.
     *
     * @return Disposed
     */
    isDisposed() {
        return this._disposed;
    }
    /**
     * Disposes this object.
     */
    dispose() {
        if (!this._disposed) {
            this._disposed = true;
            this._dispose();
        }
    }
}
/**
 * Base class.
 *
 * @important
 */
export class Entity extends Settings {
    /**
     * IMPORTANT! Do not instantiate this class via `new Class()` syntax.
     *
     * Use static method `Class.new()` instead.
     *
     * @see {@link https://www.amcharts.com/docs/v5/getting-started/#New_element_syntax} for more info
     * @ignore
     */
    constructor(root, settings, isReal, templates = []) {
        super(settings);
        Object.defineProperty(this, "_root", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_user_id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // for testing purposes
        Object.defineProperty(this, "states", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new States(this)
        });
        Object.defineProperty(this, "adapters", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Adapters(this)
        });
        Object.defineProperty(this, "events", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this._createEvents()
        });
        Object.defineProperty(this, "_userPrivateProperties", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_dirty", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_dirtyPrivate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_template", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // Templates for the themes
        Object.defineProperty(this, "_templates", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        // Internal templates which can be overridden by the user's templates
        Object.defineProperty(this, "_internalTemplates", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // Default themes which can be overridden by the user's themes
        Object.defineProperty(this, "_defaultThemes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        // Disposers for all of the templates
        Object.defineProperty(this, "_templateDisposers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_disposers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        // Whether the template setup function should be run
        Object.defineProperty(this, "_runSetup", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "_disposerProperties", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        if (!isReal) {
            throw new Error("You cannot use `new Class()`, instead use `Class.new()`");
        }
        this._root = root;
        this._internalTemplates = templates;
        if (settings.id) {
            this._registerId(settings.id);
        }
    }
    /**
     * Use this method to create an instance of this class.
     *
     * @see {@link https://www.amcharts.com/docs/v5/getting-started/#New_element_syntax} for more info
     * @param   root      Root element
     * @param   settings  Settings
     * @param   template  Template
     * @return            Instantiated object
     */
    static new(root, settings, template) {
        const x = (new this(root, settings, true));
        x._template = template;
        x._afterNew();
        return x;
    }
    static _new(root, settings, templates = []) {
        const x = (new this(root, settings, true, templates));
        x._afterNew();
        return x;
    }
    _afterNew() {
        this._checkDirty();
        let shouldApply = false;
        const template = this._template;
        if (template) {
            shouldApply = true;
            template._setObjectTemplate(this);
        }
        $array.each(this._internalTemplates, (template) => {
            shouldApply = true;
            template._setObjectTemplate(this);
        });
        if (shouldApply) {
            this._applyTemplates(false);
        }
        this.states.create("default", {});
        this._setDefaults();
    }
    // This is the same as _afterNew, except it also applies the themes.
    // This should only be used for classes which don't have a parent (because they extend from Entity and not Sprite).
    _afterNewApplyThemes() {
        this._checkDirty();
        const template = this._template;
        if (template) {
            template._setObjectTemplate(this);
        }
        $array.each(this._internalTemplates, (template) => {
            template._setObjectTemplate(this);
        });
        this.states.create("default", {});
        this._setDefaults();
        this._applyThemes();
    }
    _createEvents() {
        return new EventDispatcher();
    }
    /**
     * @ignore
     */
    get classNames() {
        return this.constructor.classNames;
    }
    /**
     * @ignore
     */
    get className() {
        return this.constructor.className;
    }
    _setDefaults() {
    }
    _setDefault(key, value) {
        if (!(key in this._settings)) {
            super.set(key, value);
        }
    }
    _setRawDefault(key, value) {
        if (!(key in this._settings)) {
            super.setRaw(key, value);
        }
    }
    _clearDirty() {
        $object.keys(this._dirty).forEach((key) => {
            this._dirty[key] = false;
        });
        $object.keys(this._dirtyPrivate).forEach((key) => {
            this._dirtyPrivate[key] = false;
        });
    }
    /**
     * @ignore
     */
    isDirty(key) {
        return !!this._dirty[key];
    }
    /**
     * @ignore
     */
    isPrivateDirty(key) {
        return !!this._dirtyPrivate[key];
    }
    _markDirtyKey(key) {
        this._dirty[key] = true;
        super._markDirtyKey(key);
    }
    _markDirtyPrivateKey(key) {
        this._dirtyPrivate[key] = true;
        super._markDirtyKey(key);
    }
    /**
     * Checks if element is of certain class (or inherits one).
     *
     * @param   type  Class name to check
     * @return {boolean} Is of class?
     */
    isType(type) {
        return this.classNames.indexOf(type) !== -1;
    }
    _pushPropertyDisposer(key, disposer) {
        let disposers = this._disposerProperties[key];
        if (disposers === undefined) {
            disposers = this._disposerProperties[key] = [];
        }
        disposers.push(disposer);
        return disposer;
    }
    _disposeProperty(key) {
        const disposers = this._disposerProperties[key];
        if (disposers !== undefined) {
            $array.each(disposers, (disposer) => {
                disposer.dispose();
            });
            delete this._disposerProperties[key];
        }
    }
    /**
     * @todo needs description
     * @param  value  Template
     */
    set template(value) {
        const template = this._template;
        if (template !== value) {
            this._template = value;
            if (template) {
                template._removeObjectTemplate(this);
            }
            if (value) {
                value._setObjectTemplate(this);
            }
            this._applyTemplates();
        }
    }
    get template() {
        return this._template;
    }
    /**
     * @ignore
     */
    markDirty() {
        this._root._addDirtyEntity(this);
    }
    _startAnimation() {
        this._root._addAnimation(this);
    }
    _animationTime() {
        return this._root.animationTime;
    }
    _applyState(_name) { }
    _applyStateAnimated(_name, _duration) { }
    get(key, fallback) {
        const value = this.adapters.fold(key, this._settings[key]);
        if (value !== undefined) {
            return value;
        }
        else {
            return fallback;
        }
    }
    /**
     * @ignore
     */
    isUserSetting(key) {
        return this._userProperties[key] || false;
    }
    /**
     * Sets a setting `value` for the specified `key`, and returns the same `value`.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/} for more info
     * @param   key       Setting key
     * @param   value     Setting value
     * @return            Setting value
     */
    set(key, value) {
        this._userProperties[key] = true;
        return super.set(key, value);
    }
    /**
     * @ignore
     */
    setRaw(key, value) {
        this._userProperties[key] = true;
        super.setRaw(key, value);
    }
    /**
     * Sets a setting `value` for the specified `key` only if the value for this key was not set previously using set method, and returns the same `value`.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/} for more info
     * @param   key       Setting key
     * @param   value     Setting value
     * @return            Setting value
     */
    _setSoft(key, value) {
        if (!this._userProperties[key]) {
            return super.set(key, value);
        }
        return value;
    }
    /**
     * Removes a setting value for the specified `key`.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/} for more info
     * @param   key       Setting key
     */
    remove(key) {
        delete this._userProperties[key];
        this._removeTemplateProperty(key);
    }
    /**
     * @ignore
     */
    setPrivate(key, value) {
        this._userPrivateProperties[key] = true;
        return super.setPrivate(key, value);
    }
    /**
     * @ignore
     */
    setPrivateRaw(key, value) {
        this._userPrivateProperties[key] = true;
        super.setPrivateRaw(key, value);
    }
    /**
     * @ignore
     */
    removePrivate(key) {
        delete this._userPrivateProperties[key];
        this._removeTemplatePrivateProperty(key);
    }
    _setTemplateProperty(template, key, value) {
        if (!this._userProperties[key]) {
            const match = this._findTemplateByKey(key);
            if (template === match) {
                super.set(key, value);
            }
        }
    }
    _setTemplatePrivateProperty(template, key, value) {
        if (!this._userPrivateProperties[key]) {
            const match = this._findTemplateByPrivateKey(key);
            if (template === match) {
                super.setPrivate(key, value);
            }
        }
    }
    _removeTemplateProperty(key) {
        if (!this._userProperties[key]) {
            const match = this._findTemplateByKey(key);
            if (match) {
                // TODO don't stop the animation if the property didn't change
                super.set(key, match._settings[key]);
            }
            else {
                super.remove(key);
            }
        }
    }
    _removeTemplatePrivateProperty(key) {
        if (!this._userPrivateProperties[key]) {
            const match = this._findTemplateByPrivateKey(key);
            if (match) {
                // TODO don't stop the animation if the property didn't change
                super.setPrivate(key, match._privateSettings[key]);
            }
            else {
                super.removePrivate(key);
            }
        }
    }
    _walkParents(f) {
        f(this._root._rootContainer);
        f(this);
    }
    // TODO faster version of this method which is specialized to just 1 key
    _applyStateByKey(name) {
        const other = this.states.create(name, {});
        const seen = {};
        this._eachTemplate((template) => {
            const state = template.states.lookup(name);
            if (state) {
                state._apply(other, seen);
            }
        });
        $object.each(other._settings, (key) => {
            if (!seen[key] && !other._userSettings[key]) {
                other.remove(key);
            }
        });
    }
    _applyTemplate(template, state) {
        this._templateDisposers.push(template._apply(this, state));
        $object.each(template._settings, (key, value) => {
            if (!state.settings[key] && !this._userProperties[key]) {
                state.settings[key] = true;
                super.set(key, value);
            }
        });
        $object.each(template._privateSettings, (key, value) => {
            if (!state.privateSettings[key] && !this._userPrivateProperties[key]) {
                state.privateSettings[key] = true;
                super.setPrivate(key, value);
            }
        });
        if (this._runSetup && template.setup) {
            this._runSetup = false;
            template.setup(this);
        }
    }
    /**
     * Calls the closure with each template and returns the first template which is true
     */
    _findStaticTemplate(f) {
        if (this._template) {
            if (f(this._template)) {
                return this._template;
            }
        }
    }
    _eachTemplate(f) {
        this._findStaticTemplate((template) => {
            f(template);
            return false;
        });
        // _internalTemplates is sorted with most specific to the right
        $array.eachReverse(this._internalTemplates, f);
        // _templates is sorted with most specific to the left
        $array.each(this._templates, f);
    }
    _applyTemplates(remove = true) {
        if (remove) {
            this._disposeTemplates();
        }
        const state = {
            settings: {},
            privateSettings: {},
            states: {},
        };
        this._eachTemplate((template) => {
            this._applyTemplate(template, state);
        });
        if (remove) {
            $object.each(this._settings, (key) => {
                if (!this._userProperties[key] && !state.settings[key]) {
                    super.remove(key);
                }
            });
            $object.each(this._privateSettings, (key) => {
                if (!this._userPrivateProperties[key] && !state.privateSettings[key]) {
                    super.removePrivate(key);
                }
            });
        }
    }
    _findTemplate(f) {
        const value = this._findStaticTemplate(f);
        if (value === undefined) {
            // _internalTemplates is sorted with most specific to the right
            const value = $array.findReverse(this._internalTemplates, f);
            if (value === undefined) {
                // _templates is sorted with most specific to the left
                return $array.find(this._templates, f);
            }
            else {
                return value;
            }
        }
        else {
            return value;
        }
    }
    _findTemplateByKey(key) {
        return this._findTemplate((template) => {
            return key in template._settings;
        });
    }
    _findTemplateByPrivateKey(key) {
        return this._findTemplate((template) => {
            return key in template._privateSettings;
        });
    }
    _disposeTemplates() {
        $array.each(this._templateDisposers, (disposer) => {
            disposer.dispose();
        });
        this._templateDisposers.length = 0;
    }
    _removeTemplates() {
        $array.each(this._templates, (template) => {
            template._removeObjectTemplate(this);
        });
        this._templates.length = 0;
    }
    _applyThemes(force = false) {
        let isConnected = false;
        const defaults = [];
        let themes = [];
        const themeTags = new Set();
        const tags = this.get("themeTagsSelf");
        if (tags) {
            $array.each(tags, (tag) => {
                themeTags.add(tag);
            });
        }
        this._walkParents((entity) => {
            if (entity === this._root._rootContainer) {
                isConnected = true;
            }
            if (entity._defaultThemes.length > 0) {
                defaults.push(entity._defaultThemes);
            }
            const theme = entity.get("themes");
            if (theme) {
                themes.push(theme);
            }
            const tags = entity.get("themeTags");
            if (tags) {
                $array.each(tags, (tag) => {
                    themeTags.add(tag);
                });
            }
        });
        themes = defaults.concat(themes);
        this._removeTemplates();
        if (isConnected || force) {
            $array.eachReverse(this.classNames, (name) => {
                const allRules = [];
                $array.each(themes, (themes) => {
                    $array.each(themes, (theme) => {
                        const rules = theme._lookupRules(name);
                        if (rules) {
                            $array.eachReverse(rules, (rule) => {
                                const matches = rule.tags.every((tag) => {
                                    return themeTags.has(tag);
                                });
                                if (matches) {
                                    const result = $array.getFirstSortedIndex(allRules, (x) => {
                                        const order = $order.compare(rule.tags.length, x.tags.length);
                                        if (order === 0) {
                                            return $order.compareArray(rule.tags, x.tags, $order.compare);
                                        }
                                        else {
                                            return order;
                                        }
                                    });
                                    allRules.splice(result.index, 0, rule);
                                }
                            });
                        }
                    });
                });
                $array.each(allRules, (rule) => {
                    this._templates.push(rule.template);
                    rule.template._setObjectTemplate(this);
                });
            });
        }
        this._applyTemplates();
        if (isConnected || force) {
            // This causes it to only run the setup function the first time that the themes are applied
            this._runSetup = false;
        }
        return isConnected || force;
    }
    _changed() { }
    _beforeChanged() {
        if (this.isDirty("id")) {
            const id = this.get("id");
            if (id) {
                this._registerId(id);
            }
            const prevId = this._prevSettings.id;
            if (prevId) {
                delete registry.entitiesById[prevId];
            }
        }
    }
    _registerId(id) {
        if (registry.entitiesById[id] && registry.entitiesById[id] !== this) {
            throw new Error("An entity with id \"" + id + "\" already exists.");
        }
        registry.entitiesById[id] = this;
    }
    _afterChanged() { }
    /**
     * @ignore
     */
    addDisposer(disposer) {
        this._disposers.push(disposer);
        return disposer;
    }
    _dispose() {
        super._dispose();
        const template = this._template;
        if (template) {
            template._removeObjectTemplate(this);
        }
        $array.each(this._internalTemplates, (template) => {
            template._removeObjectTemplate(this);
        });
        this._removeTemplates();
        this._disposeTemplates();
        this.events.dispose();
        this._disposers.forEach((x) => {
            x.dispose();
        });
        $object.each(this._disposerProperties, (_, disposers) => {
            $array.each(disposers, (disposer) => {
                disposer.dispose();
            });
        });
        const id = this.get("id");
        if (id) {
            delete registry.entitiesById[id];
        }
    }
    /**
     * Creates and returns a "disposable" timeout.
     *
     * @param   fn     Callback
     * @param   delay  Delay in milliseconds
     * @return         Timeout disposer
     */
    setTimeout(fn, delay) {
        const id = setTimeout(() => {
            this.removeDispose(disposer);
            fn();
        }, delay);
        const disposer = new Disposer(() => {
            clearTimeout(id);
        });
        this._disposers.push(disposer);
        return disposer;
    }
    /**
     * @ignore
     */
    removeDispose(target) {
        if (!this.isDisposed()) {
            let index = $array.indexOf(this._disposers, target);
            if (index > -1) {
                this._disposers.splice(index, 1);
            }
        }
        target.dispose();
    }
    /**
     * @ignore
     */
    hasTag(tag) {
        return $array.indexOf(this.get("themeTags", []), tag) !== -1;
    }
    /**
     * @ignore
     */
    addTag(tag) {
        if (!this.hasTag(tag)) {
            const tags = this.get("themeTags", []);
            tags.push(tag);
            this.set("themeTags", tags);
        }
    }
    /**
     * @ignore
     */
    removeTag(tag) {
        if (this.hasTag(tag)) {
            const tags = this.get("themeTags", []);
            $array.remove(tags, tag);
            this.set("themeTags", tags);
        }
    }
    _t(text, locale, ...rest) {
        return this._root.language.translate(text, locale, ...rest);
    }
    /**
     * An instance of [[Root]] object.
     *
     * @readonly
     * @since 5.0.6
     * @return Root object
     */
    get root() {
        return this._root;
    }
}
Object.defineProperty(Entity, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Entity"
});
Object.defineProperty(Entity, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: ["Entity"]
});
//# sourceMappingURL=Entity.js.map