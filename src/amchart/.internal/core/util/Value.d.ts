import type { Entity } from "./Entity";
export declare class Value<T> {
    private _entity;
    private _value;
    private _dirty;
    constructor(entity: Entity, value: T);
    get(): T;
    set(value: T): void;
    get dirty(): boolean;
}
//# sourceMappingURL=Value.d.ts.map