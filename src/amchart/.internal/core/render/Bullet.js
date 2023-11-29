import { Entity } from "../../core/util/Entity";
/**
 * A universal placeholder for bullet elements.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/bullets/} for more info
 */
export class Bullet extends Entity {
    constructor() {
        super(...arguments);
        // used by MapPolygons where one data item can have multiple bullets of the same kind
        Object.defineProperty(this, "_index", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Target series object if it's a bullet for series.
         */
        Object.defineProperty(this, "series", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    _afterNew() {
        // Applying themes because bullet will not have parent
        super._afterNewApplyThemes();
    }
    _beforeChanged() {
        super._beforeChanged();
        if (this.isDirty("sprite")) {
            const sprite = this.get("sprite");
            if (sprite) {
                sprite.setAll({ position: "absolute", role: "figure" });
                this._disposers.push(sprite);
            }
        }
        if (this.isDirty("locationX") || this.isDirty("locationY")) {
            if (this.series) {
                this.series._positionBullet(this);
            }
        }
    }
}
Object.defineProperty(Bullet, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Bullet"
});
Object.defineProperty(Bullet, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Entity.classNames.concat([Bullet.className])
});
//# sourceMappingURL=Bullet.js.map