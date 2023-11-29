export class Value {
    constructor(entity, value) {
        Object.defineProperty(this, "_entity", {
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
        Object.defineProperty(this, "_dirty", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        this._entity = entity;
        this._value = value;
        entity.markDirty();
    }
    get() {
        return this._value;
    }
    set(value) {
        this._value = value;
        this._dirty = true;
        this._entity.markDirty();
    }
    get dirty() {
        return this._dirty;
    }
}
//# sourceMappingURL=Value.js.map