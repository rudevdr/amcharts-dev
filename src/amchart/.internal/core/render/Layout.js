import { Entity } from "../util/Entity";
export function eachChildren(container, f) {
    if (container.get("reverseChildren", false)) {
        container.children.eachReverse(f);
    }
    else {
        container.children.each(f);
    }
}
/**
 * Base class for [[Container]] layouts.
 */
export class Layout extends Entity {
}
Object.defineProperty(Layout, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Layout"
});
Object.defineProperty(Layout, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Entity.classNames.concat([Layout.className])
});
//# sourceMappingURL=Layout.js.map