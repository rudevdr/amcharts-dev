import { Entity } from "./Entity";
import { Color } from "./Color";
import * as $type from "./Type";
import * as $object from "./Object";
import * as $array from "./Array";
/**
 * A tool that can process the data before it is being used in charts.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/data/#Pre_processing_data} for more info
 * @important
 */
export class DataProcessor extends Entity {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_checkDates", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_checkNumbers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_checkColors", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_checkEmpty", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_checkDeep", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
    _afterNew() {
        super._afterNew();
        this._checkFeatures();
        this.on("dateFields", () => this._checkFeatures());
        this.on("dateFormat", () => this._checkFeatures());
        this.on("numericFields", () => this._checkFeatures());
        this.on("colorFields", () => this._checkFeatures());
        this.on("emptyAs", () => this._checkFeatures());
    }
    _checkFeatures() {
        if (this.isDirty("dateFields") || this.isDirty("dateFormat")) {
            this._checkDates = this.get("dateFields") && (this.get("dateFields").length > 0);
        }
        if (this.isDirty("numericFields")) {
            this._checkNumbers = this.get("numericFields") && (this.get("numericFields").length > 0);
        }
        if (this.isDirty("colorFields")) {
            this._checkColors = this.get("colorFields") && (this.get("colorFields").length > 0);
        }
        if (this.isDirty("emptyAs")) {
            this._checkEmpty = this.get("emptyAs") != null;
        }
        this._checkDeepFeatures();
    }
    _checkDeepFeatures() {
        const deepFields = [];
        $array.each(["dateFields", "numericFields", "colorFields"], (where) => {
            $array.each(this.get(where, []), (field) => {
                const steps = field.split(".");
                steps.pop();
                while (steps.length > 0) {
                    deepFields.push(steps.join("."));
                    steps.pop();
                }
            });
        });
        this._checkDeep = deepFields.length > 0;
        this.setPrivate("deepFields", deepFields);
    }
    /**
     * Processess entire array of data.
     *
     * NOTE: calling this will modify original array!
     */
    processMany(data) {
        if ($type.isArray(data) && (this._checkDates || this._checkNumbers || this._checkColors || this._checkEmpty)) {
            $array.each(data, (row) => {
                this.processRow(row);
            });
        }
    }
    /**
     * Processes a row (object) of data.
     *
     * NOTE: calling this will modify values of the original object!
     */
    processRow(row, prefix = "") {
        $object.each(row, (key, _value) => {
            const lookupKey = prefix + key;
            if (this._checkEmpty) {
                row[key] = this._maybeToEmpty(row[key]);
            }
            if (this._checkNumbers) {
                row[key] = this._maybeToNumber(lookupKey, row[key]);
            }
            if (this._checkDates) {
                row[key] = this._maybeToDate(lookupKey, row[key]);
            }
            if (this._checkColors) {
                row[key] = this._maybeToColor(lookupKey, row[key]);
            }
            if (this._checkDeep && this.getPrivate("deepFields", []).indexOf(lookupKey) !== -1 && $type.isObject(row[key])) {
                this.processRow(row[key], lookupKey + ".");
            }
        });
    }
    _maybeToNumber(field, value) {
        if (this.get("numericFields").indexOf(field) !== -1) {
            return $type.toNumber(value);
        }
        return value;
    }
    _maybeToDate(field, value) {
        if (this.get("dateFields").indexOf(field) !== -1) {
            return this._root.dateFormatter.parse(value, this.get("dateFormat", "")).getTime();
        }
        return value;
    }
    _maybeToEmpty(value) {
        if ((value == null || value == "") && this.get("emptyAs") != null) {
            return this.get("emptyAs");
        }
        return value;
    }
    _maybeToColor(field, value) {
        if (this.get("colorFields").indexOf(field) !== -1) {
            return Color.fromAny(value);
        }
        return value;
    }
}
//# sourceMappingURL=DataProcessor.js.map