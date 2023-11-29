import { List } from "./List";
/**
 * A [[List]] that holds components data.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/data/} for more info
 */
export class ListData extends List {
    constructor() {
        super(...arguments);
        /**
         * An optional processor for data.
         *
         * @see {@link https://www.amcharts.com/docs/v5/concepts/data/#Pre_processing_data} for more info
         */
        Object.defineProperty(this, "processor", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    /**
     * @ignore
     */
    incrementRef() { }
    /**
     * @ignore
     */
    decrementRef() { }
    _onPush(newValue) {
        if (this.processor) {
            this.processor.processRow(newValue);
        }
        super._onPush(newValue);
    }
    _onInsertIndex(index, newValue) {
        if (this.processor) {
            this.processor.processRow(newValue);
        }
        super._onInsertIndex(index, newValue);
    }
    _onSetIndex(index, oldValue, newValue) {
        if (this.processor) {
            this.processor.processRow(newValue);
        }
        super._onSetIndex(index, oldValue, newValue);
    }
}
/**
 * @deprecated
 * @todo remove
 */
export class JsonData {
    constructor(value) {
        Object.defineProperty(this, "processor", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_value", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._value = value;
    }
    incrementRef() { }
    decrementRef() { }
}
//# sourceMappingURL=Data.js.map