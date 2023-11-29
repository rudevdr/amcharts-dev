import * as $object from "./Object";
import * as $ease from "./Ease";
/**
 * An object representing a collection of setting values to apply as required.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/states/} for more info
 */
export class State {
    constructor(entity, settings) {
        Object.defineProperty(this, "_entity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_settings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_userSettings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        this._entity = entity;
        this._settings = settings;
        $object.each(settings, (key) => {
            this._userSettings[key] = true;
        });
    }
    get(key, fallback) {
        const value = this._settings[key];
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
    setRaw(key, value) {
        this._settings[key] = value;
    }
    /**
     * Sets a setting `value` for the specified `key` to be set when the state
     * is applied.
     *
     * @param   key       Setting key
     * @param   value     Setting value
     * @return            Setting value
     */
    set(key, value) {
        this._userSettings[key] = true;
        this.setRaw(key, value);
    }
    /**
     * Removes a setting value for the specified `key`.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/} for more info
     * @param   key       Setting key
     */
    remove(key) {
        delete this._userSettings[key];
        delete this._settings[key];
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
        $object.keys(settings).forEach((key) => {
            this.set(key, settings[key]);
        });
    }
    _eachSetting(f) {
        $object.each(this._settings, f);
    }
    /**
     * Applies the state to the target element.
     *
     * All setting values are set immediately.
     */
    apply() {
        const seen = {};
        seen["stateAnimationEasing"] = true;
        seen["stateAnimationDuration"] = true;
        const defaultState = this._entity.states.lookup("default");
        this._eachSetting((key, value) => {
            if (!seen[key]) {
                seen[key] = true;
                // save values to default state
                if (this !== defaultState) {
                    if (!(key in defaultState._settings)) {
                        defaultState._settings[key] = this._entity.get(key);
                    }
                }
                this._entity.set(key, value);
            }
        });
    }
    /**
     * Applies the state to the target element.
     *
     * Returns an object representing all [[Animation]] objects created for
     * each setting key transition.
     *
     * @return           Animations
     */
    applyAnimate(duration) {
        if (duration == null) {
            duration = this._settings.stateAnimationDuration;
        }
        if (duration == null) {
            duration = this.get("stateAnimationDuration", this._entity.get("stateAnimationDuration", 0));
        }
        let easing = this._settings.stateAnimationEasing;
        if (easing == null) {
            easing = this.get("stateAnimationEasing", this._entity.get("stateAnimationEasing", $ease.cubic));
        }
        const defaultState = this._entity.states.lookup("default");
        const seen = {};
        seen["stateAnimationEasing"] = true;
        seen["stateAnimationDuration"] = true;
        const animations = {};
        this._eachSetting((key, value) => {
            if (!seen[key]) {
                seen[key] = true;
                // save values to default state
                if (this != defaultState) {
                    if (!(key in defaultState._settings)) {
                        defaultState._settings[key] = this._entity.get(key);
                    }
                }
                const animation = this._entity.animate({
                    key: key,
                    to: value,
                    duration: duration,
                    easing: easing
                });
                if (animation) {
                    animations[key] = animation;
                }
            }
        });
        return animations;
    }
}
/**
 * Collection of [[State]] objects for an element.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/states/} for more info
 */
export class States {
    constructor(entity) {
        Object.defineProperty(this, "_states", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_entity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._entity = entity;
    }
    /**
     * Checks if a state by `name` exists. Returns it there is one.
     *
     * @param  name  State name
     * @return       State
     */
    lookup(name) {
        return this._states[name];
    }
    /**
     * Sets supplied `settings` on a state by the `name`.
     *
     * If such state does not yet exists, it is created.
     *
     * @param   name      State name
     * @param   settings  Settings
     * @return            New State
     */
    create(name, settings) {
        const state = this._states[name];
        if (state) {
            state.setAll(settings);
            return state;
        }
        else {
            const state = new State(this._entity, settings);
            this._states[name] = state;
            return state;
        }
    }
    /**
     * Removes the state called `name`.
     *
     * @param   name      State name
     */
    remove(name) {
        delete this._states[name];
    }
    /**
     * Applies a named state to the target element.
     *
     * @param  newState  State name
     */
    apply(newState) {
        const state = this._states[newState];
        if (state) {
            state.apply();
        }
        this._entity._applyState(newState);
    }
    /**
     * Applies a named state to the element.
     *
     * Returns an object representing all [[Animation]] objects created for
     * each setting key transition.
     *
     * @param   newState  State name
     * @return            Animations
     */
    applyAnimate(newState, duration) {
        let animations;
        const state = this._states[newState];
        if (state) {
            animations = state.applyAnimate(duration);
        }
        this._entity._applyStateAnimated(newState, duration);
        return animations;
    }
}
//# sourceMappingURL=States.js.map