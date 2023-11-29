import { EventDispatcher } from "./EventDispatcher";
import * as $array from "./Array";
/**
 * Checks if specific index fits into length.
 *
 * @param index  Index
 * @param len    Length
 * @ignore
 */
function checkBounds(index, len) {
    if (!(index >= 0 && index < len)) {
        throw new Error("Index out of bounds: " + index);
    }
}
/**
 * A List class is used to hold a number of indexed items of the same type.
 */
export class List {
    /**
     * Constructor
     *
     * @param initial  Inital list of values to add to list
     */
    constructor(initial = []) {
        /**
         * List values.
         */
        Object.defineProperty(this, "_values", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "events", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new EventDispatcher()
        });
        this._values = initial;
    }
    /**
     * An array of values in the list.
     *
     * Do not use this property to add values. Rather use dedicated methods, like
     * `push()`, `removeIndex()`, etc.
     *
     * @readonly
     * @return List values
     */
    get values() {
        return this._values;
    }
    /**
     * Checks if list contains specific item reference.
     *
     * @param item  Item to search for
     * @return `true` if found, `false` if not found
     */
    contains(value) {
        return this._values.indexOf(value) !== -1;
    }
    /**
     * Removes specific item from the list.
     *
     * @param item An item to remove
     */
    removeValue(value) {
        let i = 0;
        let length = this._values.length;
        while (i < length) {
            // TODO handle NaN
            if (this._values[i] === value) {
                this.removeIndex(i);
                --length;
            }
            else {
                ++i;
            }
        }
    }
    /**
     * Searches the list for specific item and returns its index.
     *
     * @param item  An item to search for
     * @return Index or -1 if not found
     */
    indexOf(value) {
        return $array.indexOf(this._values, value);
    }
    /**
     * Number of items in list.
     *
     * @readonly
     * @return Number of items
     */
    get length() {
        return this._values.length;
    }
    /**
     * Checks if there's a value at specific index.
     *
     * @param index  Index
     * @return Value exists?
     */
    hasIndex(index) {
        return index >= 0 && index < this._values.length;
    }
    /**
     * Returns an item at specified index.
     *
     * @param index  Index
     * @return List item
     */
    getIndex(index) {
        return this._values[index];
    }
    _onPush(newValue) {
        if (this.events.isEnabled("push")) {
            this.events.dispatch("push", {
                type: "push",
                target: this,
                newValue
            });
        }
    }
    _onInsertIndex(index, newValue) {
        if (this.events.isEnabled("insertIndex")) {
            this.events.dispatch("insertIndex", {
                type: "insertIndex",
                target: this,
                index,
                newValue
            });
        }
    }
    _onSetIndex(index, oldValue, newValue) {
        if (this.events.isEnabled("setIndex")) {
            this.events.dispatch("setIndex", {
                type: "setIndex",
                target: this,
                index,
                oldValue,
                newValue
            });
        }
    }
    _onRemoveIndex(index, oldValue) {
        if (this.events.isEnabled("removeIndex")) {
            this.events.dispatch("removeIndex", {
                type: "removeIndex",
                target: this,
                index,
                oldValue
            });
        }
    }
    _onMoveIndex(oldIndex, newIndex, value) {
        if (this.events.isEnabled("moveIndex")) {
            this.events.dispatch("moveIndex", {
                type: "moveIndex",
                target: this,
                oldIndex,
                newIndex,
                value,
            });
        }
    }
    _onClear(oldValues) {
        if (this.events.isEnabled("clear")) {
            this.events.dispatch("clear", {
                type: "clear",
                target: this,
                oldValues
            });
        }
    }
    /**
     * Sets value at specific index.
     *
     * If there's already a value at the index, it is overwritten.
     *
     * @param index  Index
     * @param value  New value
     * @return New value
     */
    setIndex(index, value) {
        checkBounds(index, this._values.length);
        const oldValue = this._values[index];
        // Do nothing if the old value and the new value are the same
        if (oldValue !== value) {
            this._values[index] = value;
            this._onSetIndex(index, oldValue, value);
        }
        return oldValue;
    }
    /**
     * Adds an item to the list at a specific index, which pushes all the other
     * items further down the list.
     *
     * @param index Index
     * @param item  An item to add
     */
    insertIndex(index, value) {
        checkBounds(index, this._values.length + 1);
        $array.insertIndex(this._values, index, value);
        this._onInsertIndex(index, value);
        return value;
    }
    /**
     * Swaps indexes of two items in the list.
     *
     * @param a  Item 1
     * @param b  Item 2
     */
    swap(a, b) {
        const len = this._values.length;
        checkBounds(a, len);
        checkBounds(b, len);
        if (a !== b) {
            const value_a = this._values[a];
            const value_b = this._values[b];
            this._values[a] = value_b;
            this._onSetIndex(a, value_a, value_b);
            this._values[b] = value_a;
            this._onSetIndex(b, value_b, value_a);
        }
    }
    /**
     * Removes a value at specific index.
     *
     * @param index  Index of value to remove
     * @return Removed value
     */
    removeIndex(index) {
        checkBounds(index, this._values.length);
        const oldValue = this._values[index];
        $array.removeIndex(this._values, index);
        this._onRemoveIndex(index, oldValue);
        return oldValue;
    }
    /**
     * Moves an item to a specific index within the list.
     *
     * If the index is not specified it will move the item to the end of the
     * list.
     *
     * @param value  Item to move
     * @param index  Index to place item at
     */
    moveValue(value, toIndex) {
        // TODO don't do anything if the desired index is the same as the current index
        let index = this.indexOf(value);
        // TODO remove all old values rather than only the first ?
        if (index !== -1) {
            $array.removeIndex(this._values, index);
            if (toIndex == null) {
                const toIndex = this._values.length;
                this._values.push(value);
                this._onMoveIndex(index, toIndex, value);
            }
            else {
                $array.insertIndex(this._values, toIndex, value);
                this._onMoveIndex(index, toIndex, value);
            }
        }
        else if (toIndex == null) {
            this._values.push(value);
            this._onPush(value);
        }
        else {
            $array.insertIndex(this._values, toIndex, value);
            this._onInsertIndex(toIndex, value);
        }
        return value;
    }
    /**
     * Adds an item to the end of the list.
     *
     * @param item  An item to add
     */
    push(value) {
        this._values.push(value);
        this._onPush(value);
        return value;
    }
    /**
     * Adds an item as a first item in the list.
     *
     * @param item  An item to add
     */
    unshift(value) {
        this.insertIndex(0, value);
        return value;
    }
    /**
     * Adds multiple items to the list.
     *
     * @param items  An Array of items to add
     */
    pushAll(values) {
        $array.each(values, (value) => {
            this.push(value);
        });
    }
    /**
     * Copies and adds items from abother list.
     *
     * @param source  A list top copy items from
     */
    copyFrom(source) {
        this.pushAll(source._values);
    }
    /**
     * Returns the last item from the list, and removes it.
     *
     * @return Item
     */
    pop() {
        let index = this._values.length - 1;
        return index < 0 ? undefined : this.removeIndex(this._values.length - 1);
    }
    /**
     * Returns the first item from the list, and removes it.
     *
     * @return Item
     */
    shift() {
        return this._values.length ? this.removeIndex(0) : undefined;
    }
    /**
     * Sets multiple items to the list.
     *
     * All current items are removed.
     *
     * @param newArray  New items
     */
    setAll(newArray) {
        const old = this._values;
        this._values = [];
        this._onClear(old);
        $array.each(newArray, (value) => {
            this._values.push(value);
            this._onPush(value);
        });
    }
    /**
     * Removes all items from the list.
     */
    clear() {
        this.setAll([]);
    }
    /**
     * Returns an ES6 iterator for the list.
     */
    *[Symbol.iterator]() {
        const length = this._values.length;
        for (let i = 0; i < length; ++i) {
            yield this._values[i];
        }
    }
    /**
     * Calls `f` for each element in the list.
     *
     * `f` should have at least one parameter defined which will get a current
     * item, with optional second argument - index.
     */
    each(f) {
        $array.each(this._values, f);
    }
    /**
     * Calls `f` for each element in the list, from right to left.
     *
     * `f` should have at least one parameter defined which will get a current
     * item, with optional second argument - index.
     */
    eachReverse(f) {
        $array.eachReverse(this._values, f);
    }
}
/**
 * A version of a [[List]] where the elements are disposed automatically when
 * removed from the list, unless `autoDispose` is set to `false`.
 */
export class ListAutoDispose extends List {
    constructor() {
        super(...arguments);
        /**
         * Automatically disposes elements that are removed from the list.
         *
         * @default true
         */
        Object.defineProperty(this, "autoDispose", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "_disposed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
    _onSetIndex(index, oldValue, newValue) {
        if (this.autoDispose) {
            oldValue.dispose();
        }
        super._onSetIndex(index, oldValue, newValue);
    }
    _onRemoveIndex(index, oldValue) {
        if (this.autoDispose) {
            oldValue.dispose();
        }
        super._onRemoveIndex(index, oldValue);
    }
    _onClear(oldValues) {
        if (this.autoDispose) {
            $array.each(oldValues, (x) => {
                x.dispose();
            });
        }
        super._onClear(oldValues);
    }
    isDisposed() {
        return this._disposed;
    }
    dispose() {
        if (!this._disposed) {
            this._disposed = true;
            if (this.autoDispose) {
                $array.each(this._values, (x) => {
                    x.dispose();
                });
            }
        }
    }
}
/**
 * A version of a [[List]] that is able to create new elements as well as
 * apply additional settings to newly created items.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/list-templates/} for more info
 */
export class ListTemplate extends ListAutoDispose {
    constructor(template, make) {
        super();
        Object.defineProperty(this, "template", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "make", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.template = template;
        this.make = make;
    }
}
//# sourceMappingURL=List.js.map