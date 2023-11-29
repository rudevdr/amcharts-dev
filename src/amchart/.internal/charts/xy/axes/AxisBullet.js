import { Entity } from "../../../core/util/Entity";
import * as $object from "../../../core/util/Object";
/**
 * Draws a bullet on an axis.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/#Axis_bullets} for more info
 */
export class AxisBullet extends Entity {
    constructor() {
        super(...arguments);
        /**
         * Target axis object.
         */
        Object.defineProperty(this, "axis", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    _beforeChanged() {
        super._beforeChanged();
        const sprite = this.get("sprite");
        if (this.isDirty("sprite")) {
            if (sprite) {
                sprite.setAll({ position: "absolute", role: "figure" });
                this._disposers.push(sprite);
            }
        }
        if (this.isDirty("location")) {
            const dataItem = sprite.dataItem;
            if (this.axis && sprite && dataItem) {
                this.axis._prepareDataItem(dataItem);
            }
        }
    }
    dispose() {
        const axis = this.axis;
        if (axis) {
            $object.each(axis._bullets, (key, bullet) => {
                if (bullet.uid == this.uid) {
                    delete axis._bullets[key];
                }
            });
        }
        super.dispose();
    }
}
Object.defineProperty(AxisBullet, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "AxisBullet"
});
Object.defineProperty(AxisBullet, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Entity.classNames.concat([AxisBullet.className])
});
//# sourceMappingURL=AxisBullet.js.map