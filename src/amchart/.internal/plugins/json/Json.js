import { __awaiter } from "tslib";
import { Entity } from "../../core/util/Entity";
import { Sprite } from "../../core/render/Sprite";
import { Container } from "../../core/render/Container";
import { Color } from "../../core/util/Color";
import { Percent } from "../../core/util/Percent";
import { Template } from "../../core/util/Template";
import * as $type from "../../core/util/Type";
import * as $array from "../../core/util/Array";
import * as $object from "../../core/util/Object";
import classes from "./Classes";
function isObject(value) {
    return $type.isObject(value);
}
function lookupRef(refs, name) {
    let i = refs.length;
    while (i--) {
        const sub = refs[i];
        if (name in sub) {
            return sub[name];
        }
    }
    throw new Error("Could not find ref " + name);
}
function parseRef(value, refs) {
    if (value[0] === "#" || value[0] === "@") {
        if (value[1] === value[0]) {
            // "##foo" or "@@foo" gets escaped into the literal strings "#foo" or "@foo"
            return {
                isValue: true,
                value: value.slice(1),
            };
        }
        else {
            const path = value.split(/\./g);
            let object = lookupRef(refs, path[0]);
            for (let i = 1; i < path.length; ++i) {
                const subpath = path[i];
                // Supports `#foo.get("bar")` and `#foo.get('bar')` syntax
                const parsed = /get\((["'])([^\1]*)\1\)/.exec(subpath);
                if (parsed) {
                    object = object.get(parsed[2]);
                }
                else {
                    object = object[subpath];
                }
            }
            return {
                isValue: true,
                value: object,
            };
        }
    }
    else {
        return {
            isValue: true,
            value,
        };
    }
}
function mergeObject(entity, parsed) {
    if (parsed.properties) {
        $array.each(parsed.properties, (fn) => {
            fn(entity);
        });
    }
}
function mergeEntity(entity, parsed) {
    mergeObject(entity, parsed);
    if (parsed.adapters) {
        $array.each(parsed.adapters, (adapter) => {
            entity.adapters.add(adapter.key, adapter.callback);
        });
    }
    if (entity instanceof Container) {
        if (parsed.children) {
            parsed.children.forEach((child) => {
                if (child.index == null) {
                    entity.children.push(child.value);
                }
                else {
                    entity.children.insertIndex(child.index, child.value);
                }
            });
        }
    }
}
function mergeExisting(entity, parsed) {
    if (parsed.settings) {
        entity.setAll(parsed.settings);
    }
    mergeEntity(entity, parsed);
}
function constructEntity(root, parsed) {
    if (!parsed.construct) {
        return parsed.value;
    }
    const entity = parsed.construct.new(root, parsed.settings || {});
    mergeEntity(entity, parsed);
    return entity;
}
class ParserState {
    constructor() {
        Object.defineProperty(this, "_caching", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_cache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_delayed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
    }
    afterParse() {
        this._delayed.forEach((f) => {
            f();
        });
    }
    getClass(name) {
        return this._cache[name];
    }
    storeClass(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const promise = classes[name];
            this._cache[name] = (yield promise());
        });
    }
    cacheClass(name) {
        let promise = this._caching[name];
        if (promise == null) {
            promise = this._caching[name] = this.storeClass(name);
        }
        return promise;
    }
    parseAsyncArray(array) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all($array.map(array, (x) => this.parseAsync(x)));
        });
    }
    parseAsyncObject(object) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all($array.map($object.keys(object), (key) => this.parseAsync(object[key])));
        });
    }
    parseAsyncSettings(object) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all($array.map($object.keys(object), (key) => this.parseAsyncSetting(key, object[key])));
        });
    }
    parseAsyncSetting(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (key !== "geoJSON") {
                yield this.parseAsync(value);
            }
        });
    }
    parseAsyncRefs(refs) {
        return __awaiter(this, void 0, void 0, function* () {
            if ($type.isArray(refs)) {
                yield Promise.all($array.map(refs, (x) => this.parseAsyncRefs(x)));
            }
            else {
                yield this.parseAsyncObject(refs);
            }
        });
    }
    parseAsync(value) {
        return __awaiter(this, void 0, void 0, function* () {
            if ($type.isArray(value)) {
                yield this.parseAsyncArray(value);
            }
            else if (isObject(value)) {
                if (value.type === "Color" || value.type === "Percent") {
                    // Do nothing
                }
                else if (value.type === "Template") {
                    yield Promise.all([
                        (value.refs ? this.parseAsyncRefs(value.refs) : Promise.resolve(undefined)),
                        (value.settings ? this.parseAsyncObject(value.settings) : Promise.resolve(undefined)),
                    ]);
                }
                else if (value.__parse === true) {
                    yield this.parseAsyncObject(value);
                }
                else if (value.__parse !== false) {
                    yield Promise.all([
                        (value.type ? this.cacheClass(value.type) : Promise.resolve(undefined)),
                        (value.refs ? this.parseAsyncRefs(value.refs) : Promise.resolve(undefined)),
                        (value.settings ? this.parseAsyncSettings(value.settings) : Promise.resolve(undefined)),
                        (value.properties ? this.parseAsyncObject(value.properties) : Promise.resolve(undefined)),
                        (value.children ? this.parseAsyncArray(value.children) : Promise.resolve(undefined)),
                    ]);
                }
            }
        });
    }
    parseObject(root, object, refs) {
        const output = {};
        $array.each($object.keys(object), (key) => {
            output[key] = this.parse(root, object[key], refs);
        });
        return output;
    }
    parseArray(root, value, refs) {
        return $array.map(value, (value) => this.parse(root, value, refs));
    }
    parseChildren(root, value, refs) {
        return $array.map(value, (value) => this.parseChild(root, value, refs));
    }
    parseStops(root, value, refs) {
        return $array.map(value, (value) => this.parseObject(root, value, refs));
    }
    parseSetting(root, key, value, refs) {
        if (key === "layout") {
            switch (value) {
                case "horizontal":
                    return root.horizontalLayout;
                case "vertical":
                    return root.verticalLayout;
                case "grid":
                    return root.gridLayout;
            }
        }
        if (key === "geoJSON") {
            return value;
        }
        if (key === "stops") {
            return this.parseStops(root, value, refs);
        }
        return this.parse(root, value, refs);
    }
    parseSettings(root, object, refs) {
        const settings = {};
        $array.each($object.keys(object), (key) => {
            settings[key] = this.parseSetting(root, key, object[key], refs);
        });
        return settings;
    }
    parseProperties(root, object, refs) {
        return $array.map($object.keys(object), (key) => {
            const rawValue = object[key];
            return (entity) => {
                const run = () => {
                    const parsed = this.parseValue(root, rawValue, refs);
                    const old = entity[key];
                    if (old) {
                        if (parsed.isValue) {
                            // Merge Array into List
                            if ($type.isArray(parsed.value)) {
                                $array.each(parsed.value, (value) => {
                                    old.push(value);
                                });
                            }
                            else {
                                entity[key] = parsed.value;
                            }
                        }
                        else if (parsed.construct) {
                            entity[key] = constructEntity(root, parsed);
                            // Merge into existing Entity or Template
                        }
                        else if (old instanceof Entity || old instanceof Template) {
                            mergeExisting(old, parsed);
                            // Merge into existing object
                        }
                        else {
                            mergeObject(old, parsed);
                        }
                    }
                    else {
                        if (parsed.isValue) {
                            entity[key] = parsed.value;
                        }
                        else {
                            entity[key] = constructEntity(root, parsed);
                        }
                    }
                };
                if (key === "data") {
                    this._delayed.push(run);
                }
                else if (key === "bullets") {
                    const old = entity[key];
                    $type.assert(old != null);
                    $type.assert($type.isArray(rawValue));
                    $array.each(rawValue, (value) => {
                        old.push((_, series) => {
                            const newRefs = refs.concat([{ "@series": series }]);
                            return this.parse(root, value, newRefs);
                        });
                    });
                }
                else {
                    run();
                }
            };
        });
    }
    parseRefsObject(root, object, refs) {
        const newRefs = {};
        $array.each($object.keys(object), (key) => {
            newRefs["#" + key] = this.parse(root, object[key], refs);
        });
        return newRefs;
    }
    parseRefs(root, object, refs) {
        if ($type.isArray(object)) {
            const length = object.length;
            for (let i = 0; i < length; ++i) {
                refs = refs.concat([this.parseRefsObject(root, object[i], refs)]);
            }
        }
        else {
            refs = refs.concat([this.parseRefsObject(root, object, refs)]);
        }
        return refs;
    }
    parseChild(root, value, refs) {
        if ($type.isString(value)) {
            return {
                index: undefined,
                value: parseRef(value, refs).value,
            };
        }
        else if (value.ref != null) {
            const index = (value.index == null ? undefined : value.index);
            return {
                index,
                value: parseRef(value.ref, refs).value,
            };
        }
        else {
            const parsed = this.parseEntity(root, value, refs);
            return {
                index: parsed.index,
                value: constructEntity(root, parsed),
            };
        }
    }
    parseEntity(root, value, refs) {
        if (value.refs) {
            refs = this.parseRefs(root, value.refs, refs);
        }
        const construct = (value.type ? this.getClass(value.type) : undefined);
        const settings = (value.settings ? this.parseSettings(root, value.settings, refs) : undefined);
        const properties = (value.properties ? this.parseProperties(root, value.properties, refs) : undefined);
        const children = (value.children ? this.parseChildren(root, value.children, refs) : undefined);
        const index = (value.index == null ? undefined : value.index);
        return {
            isValue: false,
            type: value.type,
            construct,
            settings,
            adapters: value.adapters,
            children,
            properties,
            index,
            value,
        };
    }
    parseValue(root, value, refs) {
        if (value instanceof Entity) {
            return { isValue: true, value: value };
        }
        else if ($type.isArray(value)) {
            return {
                isValue: true,
                value: this.parseArray(root, value, refs),
            };
        }
        else if (isObject(value)) {
            if (value.type === "Color") {
                return {
                    isValue: true,
                    value: Color.fromAny(value.value),
                };
            }
            else if (value.type === "Percent") {
                return {
                    isValue: true,
                    value: new Percent(value.value),
                };
            }
            else if (value.type === "Template") {
                if (value.refs) {
                    refs = this.parseRefs(root, value.refs, refs);
                }
                const settings = (value.settings ? this.parseSettings(root, value.settings, refs) : {});
                return {
                    isValue: true,
                    value: Template.new(settings),
                };
            }
            else if (value.__parse === true) {
                return {
                    isValue: true,
                    value: this.parseObject(root, value, refs),
                };
            }
            else if (value.__parse === false) {
                return {
                    isValue: true,
                    value,
                };
            }
            else {
                return this.parseEntity(root, value, refs);
            }
        }
        else if ($type.isString(value)) {
            return parseRef(value, refs);
        }
        else {
            return {
                isValue: true,
                value,
            };
        }
    }
    parse(root, value, refs) {
        const parsed = this.parseValue(root, value, refs);
        if (parsed.isValue) {
            return parsed.value;
        }
        else {
            return constructEntity(root, parsed);
        }
    }
}
/**
 * A parser for JSON based chart configs.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/serializing/} for more info
 * @since 5.3.0
 */
export class JsonParser {
    /**
     * IMPORTANT! Do not instantiate this class via `new Class()` syntax.
     *
     * Use static method `Class.new()` instead.
     *
     * @see {@link https://www.amcharts.com/docs/v5/getting-started/#New_element_syntax} for more info
     * @ignore
     */
    constructor(root, isReal) {
        Object.defineProperty(this, "_root", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        if (!isReal) {
            throw new Error("You cannot use `new Class()`, instead use `Class.new()`");
        }
        this._root = root;
    }
    /**
     * Use this method to create an instance of this class.
     *
     * @see {@link https://www.amcharts.com/docs/v5/getting-started/#New_element_syntax} for more info
     * @param   root      Root element
     * @return            Instantiated object
     */
    static new(root) {
        return (new this(root, true));
    }
    /**
     * Parses and creates chart objects from simple objects.
     *
     * @param   object  Serialized data
     * @return          A promise of a target object
     */
    parse(object, settings = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = new ParserState();
            yield state.parseAsync(object);
            const output = state.parse(this._root, object, []);
            if (settings.parent) {
                if (output instanceof Sprite) {
                    settings.parent.children.push(output);
                }
                else {
                    throw new Error("When using the parent setting, the entity must be a Sprite");
                }
            }
            else if (output instanceof Entity) {
                output._applyThemes(true);
            }
            state.afterParse();
            return output;
        });
    }
    /**
     * Parses and creates chart objects from JSON string.
     *
     * @param   string  JSON string
     * @return          A promise of a target object
     */
    parseString(string, settings = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.parse(JSON.parse(string), settings);
        });
    }
}
//# sourceMappingURL=Json.js.map