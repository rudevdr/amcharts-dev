import { List } from "./List";
import * as $array from "./Array";
/**
 * A version of [[List]] to hold children of the [[Container]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/containers/} for more info
 */
export class Children extends List {
    constructor(container) {
        super();
        Object.defineProperty(this, "_disposed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_container", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_events", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._container = container;
        this._events = this.events.onAll((change) => {
            if (change.type === "clear") {
                $array.each(change.oldValues, (x) => {
                    this._onRemoved(x);
                });
            }
            else if (change.type === "push") {
                this._onInserted(change.newValue);
            }
            else if (change.type === "setIndex") {
                this._onRemoved(change.oldValue);
                this._onInserted(change.newValue, change.index);
            }
            else if (change.type === "insertIndex") {
                this._onInserted(change.newValue, change.index);
            }
            else if (change.type === "removeIndex") {
                this._onRemoved(change.oldValue);
            }
            else if (change.type === "moveIndex") {
                this._onRemoved(change.value);
                this._onInserted(change.value, change.newIndex);
            }
            else {
                throw new Error("Unknown IListEvent type");
            }
        });
    }
    _onInserted(child, index) {
        child._setParent(this._container, true);
        const childrenDisplay = this._container._childrenDisplay;
        if (index === undefined) {
            childrenDisplay.addChild(child._display);
        }
        else {
            childrenDisplay.addChildAt(child._display, index);
        }
    }
    _onRemoved(child) {
        this._container._childrenDisplay.removeChild(child._display);
        this._container.markDirtyBounds();
        this._container.markDirty();
    }
    /**
     * Returns `true` if obejct is disposed.
     */
    isDisposed() {
        return this._disposed;
    }
    /**
     * Permanently dispose this object.
     */
    dispose() {
        if (!this._disposed) {
            this._disposed = true;
            this._events.dispose();
            $array.each(this.values, (child) => {
                child.dispose();
            });
        }
    }
}
//# sourceMappingURL=Children.js.map