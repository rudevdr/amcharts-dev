import { Entity } from "../../core/util/Entity";
import { Component } from "../../core/render/Component";
import { Color } from "../../core/util/Color";
import { Percent } from "../../core/util/Percent";
import { Template } from "../../core/util/Template";
import { ListData } from "../../core/util/Data";
import * as $type from "../../core/util/Type";
import * as $array from "../../core/util/Array";
import * as $object from "../../core/util/Object";
/**
 * Provides functionality to serialize charts or individual elements into simple
 * objects or JSON.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/serializing/} for more info
 * @since 5.3.0
 */
export class Serializer extends Entity {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_refs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
    }
    /**
     * Serializes target object into a simple object or JSON string.
     *
     * @param   source  Target object
     * @param   depth   Current depth
     * @param   full    Serialize object in full (ignoring maxDepth)
     * @return          Serialized data
     */
    serialize(source, depth = 0, full = false) {
        if (depth > this.get("maxDepth", 2)) {
            return undefined;
        }
        if (source === false || source === true) {
            return source;
        }
        if ($type.isArray(source)) {
            const res = [];
            $array.each(source, (arrval) => {
                res.push(this.serialize(arrval, depth, full));
            });
            return res;
        }
        else if (source instanceof ListData) {
            const res = [];
            $array.each(source.values, (arrval) => {
                res.push(this.serialize(arrval, depth, full));
            });
            return res;
        }
        const res = {};
        const am5object = source instanceof Entity || source instanceof Template || source instanceof Color || source instanceof Percent ? true : false;
        // Process settings
        if (source instanceof Entity) {
            res.type = source.className;
            let settings = $object.keys(source._settings);
            const includeSettings = this.get("includeSettings", []);
            const excludeSettings = this.get("excludeSettings", []);
            if (includeSettings.length) {
                settings = includeSettings;
            }
            else if (excludeSettings.length) {
                settings = settings.filter((value) => {
                    return excludeSettings.indexOf(value) === -1;
                });
            }
            // Include only user settings
            settings = settings.filter((value) => {
                return source.isUserSetting(value);
            });
            if (settings.length) {
                res.settings = {};
                $array.each(settings, (setting) => {
                    const settingValue = source.get(setting);
                    if (settingValue !== undefined) {
                        res.settings[setting] = this.serialize(settingValue, depth + 1, full);
                    }
                });
            }
        }
        else if (source instanceof Template) {
            res.type = "Template";
            let settings = $object.keys(source._settings);
            if (settings.length) {
                res.settings = {};
                $array.each(settings, (setting) => {
                    res.settings[setting] = this.serialize(source.get(setting), depth + 1);
                });
            }
            return res;
        }
        // Data
        if (source instanceof Component) {
            if (source.data.length) {
                res.properties = {
                    data: this.serialize(source.data.values, 1, true)
                };
            }
        }
        // Process the rest
        if (source instanceof Color) {
            return {
                type: "Color",
                value: source.toCSSHex()
            };
        }
        else if (source instanceof Percent) {
            return {
                type: "Percent",
                value: source.percent
            };
        }
        else if ($type.isString(source) || $type.isNumber(source)) {
            return source;
        }
        else if ($type.isObject(source)) {
            // TODO
            if (full && !am5object) {
                const excludeProperties = this.get("excludeProperties", []);
                $object.each(source, (key, value) => {
                    if (excludeProperties.indexOf(key) === -1 && value !== undefined) {
                        res[key] = this.serialize(value, depth + 1, full);
                    }
                });
            }
        }
        if (depth == 0 && $object.keys(this._refs).length) {
            res.refs = this._refs;
        }
        return res;
    }
}
Object.defineProperty(Serializer, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Serializer"
});
Object.defineProperty(Serializer, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Entity.classNames.concat([Serializer.className])
});
//# sourceMappingURL=Serializer.js.map