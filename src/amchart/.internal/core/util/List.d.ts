/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import type { Entity } from "./Entity";
import type { Template } from "./Template";
import type { IDisposer } from "./Disposer";
import { EventDispatcher, Events } from "./EventDispatcher";
import type { Optional } from "./Type";
export interface IListEvents<A> {
    clear: {
        oldValues: Array<A>;
    };
    push: {
        newValue: A;
    };
    insertIndex: {
        index: number;
        newValue: A;
    };
    setIndex: {
        index: number;
        oldValue: A;
        newValue: A;
    };
    removeIndex: {
        index: number;
        oldValue: A;
    };
    moveIndex: {
        oldIndex: number;
        newIndex: number;
        value: A;
    };
}
/**
 * A List class is used to hold a number of indexed items of the same type.
 */
export declare class List<T> {
    /**
     * List values.
     */
    protected _values: Array<T>;
    events: EventDispatcher<Events<this, IListEvents<T>>>;
    /**
     * Constructor
     *
     * @param initial  Inital list of values to add to list
     */
    constructor(initial?: Array<T>);
    /**
     * An array of values in the list.
     *
     * Do not use this property to add values. Rather use dedicated methods, like
     * `push()`, `removeIndex()`, etc.
     *
     * @readonly
     * @return List values
     */
    get values(): Array<T>;
    /**
     * Checks if list contains specific item reference.
     *
     * @param item  Item to search for
     * @return `true` if found, `false` if not found
     */
    contains(value: T): boolean;
    /**
     * Removes specific item from the list.
     *
     * @param item An item to remove
     */
    removeValue(value: T): void;
    /**
     * Searches the list for specific item and returns its index.
     *
     * @param item  An item to search for
     * @return Index or -1 if not found
     */
    indexOf(value: T): number;
    /**
     * Number of items in list.
     *
     * @readonly
     * @return Number of items
     */
    get length(): number;
    /**
     * Checks if there's a value at specific index.
     *
     * @param index  Index
     * @return Value exists?
     */
    hasIndex(index: number): boolean;
    /**
     * Returns an item at specified index.
     *
     * @param index  Index
     * @return List item
     */
    getIndex(index: number): T | undefined;
    protected _onPush(newValue: T): void;
    protected _onInsertIndex(index: number, newValue: T): void;
    protected _onSetIndex(index: number, oldValue: T, newValue: T): void;
    protected _onRemoveIndex(index: number, oldValue: T): void;
    protected _onMoveIndex(oldIndex: number, newIndex: number, value: T): void;
    protected _onClear(oldValues: Array<T>): void;
    /**
     * Sets value at specific index.
     *
     * If there's already a value at the index, it is overwritten.
     *
     * @param index  Index
     * @param value  New value
     * @return New value
     */
    setIndex(index: number, value: T): T;
    /**
     * Adds an item to the list at a specific index, which pushes all the other
     * items further down the list.
     *
     * @param index Index
     * @param item  An item to add
     */
    insertIndex<K extends T>(index: number, value: K): K;
    /**
     * Swaps indexes of two items in the list.
     *
     * @param a  Item 1
     * @param b  Item 2
     */
    swap(a: number, b: number): void;
    /**
     * Removes a value at specific index.
     *
     * @param index  Index of value to remove
     * @return Removed value
     */
    removeIndex(index: number): T;
    /**
     * Moves an item to a specific index within the list.
     *
     * If the index is not specified it will move the item to the end of the
     * list.
     *
     * @param value  Item to move
     * @param index  Index to place item at
     */
    moveValue<K extends T>(value: K, toIndex?: number): K;
    /**
     * Adds an item to the end of the list.
     *
     * @param item  An item to add
     */
    push<K extends T>(value: K): K;
    /**
     * Adds an item as a first item in the list.
     *
     * @param item  An item to add
     */
    unshift<K extends T>(value: K): K;
    /**
     * Adds multiple items to the list.
     *
     * @param items  An Array of items to add
     */
    pushAll(values: Array<T>): void;
    /**
     * Copies and adds items from abother list.
     *
     * @param source  A list top copy items from
     */
    copyFrom(source: this): void;
    /**
     * Returns the last item from the list, and removes it.
     *
     * @return Item
     */
    pop(): Optional<T>;
    /**
     * Returns the first item from the list, and removes it.
     *
     * @return Item
     */
    shift(): Optional<T>;
    /**
     * Sets multiple items to the list.
     *
     * All current items are removed.
     *
     * @param newArray  New items
     */
    setAll(newArray: Array<T>): void;
    /**
     * Removes all items from the list.
     */
    clear(): void;
    /**
     * Returns an ES6 iterator for the list.
     */
    [Symbol.iterator](): Iterator<T>;
    /**
     * Calls `f` for each element in the list.
     *
     * `f` should have at least one parameter defined which will get a current
     * item, with optional second argument - index.
     */
    each(f: (value: T, index: number) => void): void;
    /**
     * Calls `f` for each element in the list, from right to left.
     *
     * `f` should have at least one parameter defined which will get a current
     * item, with optional second argument - index.
     */
    eachReverse(f: (value: T, index: number) => void): void;
}
/**
 * A version of a [[List]] where the elements are disposed automatically when
 * removed from the list, unless `autoDispose` is set to `false`.
 */
export declare class ListAutoDispose<A extends IDisposer> extends List<A> implements IDisposer {
    /**
     * Automatically disposes elements that are removed from the list.
     *
     * @default true
     */
    autoDispose: boolean;
    private _disposed;
    protected _onSetIndex(index: number, oldValue: A, newValue: A): void;
    protected _onRemoveIndex(index: number, oldValue: A): void;
    protected _onClear(oldValues: Array<A>): void;
    isDisposed(): boolean;
    dispose(): void;
}
/**
 * A version of a [[List]] that is able to create new elements as well as
 * apply additional settings to newly created items.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/list-templates/} for more info
 */
export declare class ListTemplate<A extends Entity> extends ListAutoDispose<A> {
    template: Template<A>;
    make: () => A;
    constructor(template: Template<A>, make: () => A);
}
//# sourceMappingURL=List.d.ts.map