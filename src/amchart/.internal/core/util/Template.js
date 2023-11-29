import { EventDispatcher } from "./EventDispatcher";
import { Disposer, MultiDisposer } from "./Disposer";
import * as $array from "./Array";
import * as $object from "./Object";
export class TemplateState {
    constructor(name, template, settings) {
        Object.defineProperty(this, "_settings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_template", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._name = name;
        this._template = template;
        this._settings = settings;
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
    set(key, value) {
        this._settings[key] = value;
        // TODO maybe only do this if the value changed ?
        this._template._stateChanged(this._name);
    }
    remove(key) {
        delete this._settings[key];
        // TODO maybe only do this if the value changed ?
        this._template._stateChanged(this._name);
    }
    setAll(settings) {
        $object.keys(settings).forEach((key) => {
            this._settings[key] = settings[key];
        });
        this._template._stateChanged(this._name);
    }
    _apply(other, seen) {
        $object.each(this._settings, (key, value) => {
            if (!seen[key] && !other._userSettings[key]) {
                seen[key] = true;
                other.setRaw(key, value);
            }
        });
    }
}
export class TemplateStates {
    constructor(template) {
        Object.defineProperty(this, "_template", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_states", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        this._template = template;
    }
    lookup(name) {
        return this._states[name];
    }
    create(name, settings) {
        const state = this._states[name];
        if (state) {
            state.setAll(settings);
            return state;
        }
        else {
            const state = new TemplateState(name, this._template, settings);
            this._states[name] = state;
            this._template._stateChanged(name);
            return state;
        }
    }
    remove(name) {
        delete this._states[name];
        this._template._stateChanged(name);
    }
    _apply(entity, state) {
        $object.each(this._states, (key, value) => {
            let seen = state.states[key];
            if (seen == null) {
                seen = state.states[key] = {};
            }
            const other = entity.states.create(key, {});
            value._apply(other, seen);
        });
    }
}
export class TemplateAdapters {
    constructor() {
        Object.defineProperty(this, "_callbacks", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
    }
    add(key, callback) {
        let callbacks = this._callbacks[key];
        if (callbacks === undefined) {
            callbacks = this._callbacks[key] = [];
        }
        callbacks.push(callback);
        return new Disposer(() => {
            $array.removeFirst(callbacks, callback);
            if (callbacks.length === 0) {
                delete this._callbacks[key];
            }
        });
    }
    remove(key) {
        const callbacks = this._callbacks[key];
        if (callbacks !== undefined) {
            delete this._callbacks[key];
        }
    }
    _apply(entity) {
        const disposers = [];
        $object.each(this._callbacks, (key, callbacks) => {
            $array.each(callbacks, (callback) => {
                disposers.push(entity.adapters.add(key, callback));
            });
        });
        return new MultiDisposer(disposers);
    }
}
// TODO maybe extend from Properties ?
export class Template {
    constructor(settings, isReal) {
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
        // TODO code duplication with Properties
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
        Object.defineProperty(this, "_entities", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "states", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new TemplateStates(this)
        });
        Object.defineProperty(this, "adapters", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new TemplateAdapters()
        });
        Object.defineProperty(this, "events", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new EventDispatcher()
        });
        Object.defineProperty(this, "setup", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        if (!isReal) {
            throw new Error("You cannot use `new Class()`, instead use `Class.new()`");
        }
        this._settings = settings;
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
    static new(settings) {
        return new Template(settings, true);
    }
    /**
     * Array of all entities using this template.
     */
    get entities() {
        return this._entities;
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
    setRaw(key, value) {
        this._settings[key] = value;
    }
    set(key, value) {
        if (this._settings[key] !== value) {
            this.setRaw(key, value);
            this._entities.forEach((entity) => {
                entity._setTemplateProperty(this, key, value);
            });
        }
    }
    remove(key) {
        if (key in this._settings) {
            delete this._settings[key];
            this._entities.forEach((entity) => {
                entity._removeTemplateProperty(key);
            });
        }
    }
    removeAll() {
        $object.each(this._settings, (key, _value) => {
            this.remove(key);
        });
    }
    getPrivate(key, fallback) {
        const value = this._privateSettings[key];
        if (value !== undefined) {
            return value;
        }
        else {
            return fallback;
        }
    }
    setPrivateRaw(key, value) {
        this._privateSettings[key] = value;
        return value;
    }
    setPrivate(key, value) {
        if (this._privateSettings[key] !== value) {
            this.setPrivateRaw(key, value);
            this._entities.forEach((entity) => {
                entity._setTemplatePrivateProperty(this, key, value);
            });
        }
        return value;
    }
    removePrivate(key) {
        if (key in this._privateSettings) {
            delete this._privateSettings[key];
            this._entities.forEach((entity) => {
                entity._removeTemplatePrivateProperty(key);
            });
        }
    }
    setAll(value) {
        $object.each(value, (key, value) => {
            this.set(key, value);
        });
    }
    // TODO code duplication with Properties
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
    // TODO code duplication with Properties
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
    _apply(entity, state) {
        const disposers = [];
        $object.each(this._settingEvents, (key, events) => {
            $array.each(events, (event) => {
                disposers.push(entity.on(key, event));
            });
        });
        $object.each(this._privateSettingEvents, (key, events) => {
            $array.each(events, (event) => {
                disposers.push(entity.onPrivate(key, event));
            });
        });
        this.states._apply(entity, state);
        disposers.push(this.adapters._apply(entity));
        disposers.push(entity.events.copyFrom(this.events));
        return new MultiDisposer(disposers);
    }
    _setObjectTemplate(entity) {
        this._entities.push(entity);
    }
    _removeObjectTemplate(entity) {
        $array.remove(this._entities, entity);
    }
    _stateChanged(name) {
        this._entities.forEach((entity) => {
            entity._applyStateByKey(name);
        });
    }
}
//# sourceMappingURL=Template.js.map