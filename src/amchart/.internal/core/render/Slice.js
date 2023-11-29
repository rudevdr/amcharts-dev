import { Graphics } from "./Graphics";
import * as $type from "../util/Type";
import { Percent } from "../util/Percent";
import { arc } from "d3-shape";
import * as $math from "../util/Math";
/**
 * Draws a slice shape.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/graphics/} for more info
 */
export class Slice extends Graphics {
    constructor() {
        super(...arguments);
        /**
         * @ignore
         */
        Object.defineProperty(this, "ix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        /**
         * @ignore
         */
        Object.defineProperty(this, "iy", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_generator", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: arc()
        });
    }
    _getTooltipPoint() {
        let tooltipX = this.get("tooltipX");
        let tooltipY = this.get("tooltipY");
        let x = 0;
        let y = 0;
        if ($type.isNumber(tooltipX)) {
            x = tooltipX;
        }
        if ($type.isNumber(tooltipY)) {
            y = tooltipY;
        }
        let radius = this.get("radius", 0);
        let innerRadius = this.get("innerRadius", 0);
        let dRadius = this.get("dRadius", 0);
        let dInnerRadius = this.get("dInnerRadius", 0);
        radius += dRadius;
        innerRadius += dInnerRadius;
        if (innerRadius < 0) {
            innerRadius = radius + innerRadius;
        }
        if (tooltipX instanceof Percent) {
            x = this.ix * (innerRadius + (radius - innerRadius) * tooltipX.value);
        }
        if (tooltipY instanceof Percent) {
            y = this.iy * (innerRadius + (radius - innerRadius) * tooltipY.value);
        }
        if (this.get("arc") >= 360 && innerRadius == 0) {
            x = 0;
            y = 0;
        }
        return { x, y };
    }
    _beforeChanged() {
        super._beforeChanged();
        if (this.isDirty("radius") || this.isDirty("arc") || this.isDirty("innerRadius") || this.isDirty("startAngle") || this.isDirty("dRadius") || this.isDirty("dInnerRadius") || this.isDirty("cornerRadius") || this.isDirty("shiftRadius")) {
            this._clear = true;
        }
    }
    _changed() {
        super._changed();
        if (this._clear) {
            let startAngle = this.get("startAngle", 0);
            let arc = this.get("arc", 0);
            const generator = this._generator;
            if (arc < 0) {
                startAngle = startAngle + arc;
                arc = arc * -1;
            }
            if (arc > 0.1) { // this fixes bug with full circle when arc is very small
                generator.cornerRadius(this.get("cornerRadius", 0));
            }
            generator.context(this._display);
            let radius = this.get("radius", 0);
            let innerRadius = this.get("innerRadius", 0);
            let dRadius = this.get("dRadius", 0);
            let dInnerRadius = this.get("dInnerRadius", 0);
            radius += dRadius;
            innerRadius += dInnerRadius;
            if (innerRadius < 0) {
                innerRadius = radius + innerRadius;
            }
            generator({ innerRadius: innerRadius, outerRadius: radius, startAngle: (startAngle + 90) * $math.RADIANS, endAngle: (startAngle + arc + 90) * $math.RADIANS });
            let middleAngle = startAngle + arc / 2;
            this.ix = $math.cos(middleAngle);
            this.iy = $math.sin(middleAngle);
            const shiftRadius = this.get("shiftRadius", 0);
            this.setRaw("dx", this.ix * shiftRadius);
            this.setRaw("dy", this.iy * shiftRadius);
            this.markDirtyPosition();
        }
    }
}
Object.defineProperty(Slice, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Slice"
});
Object.defineProperty(Slice, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Graphics.classNames.concat([Slice.className])
});
//# sourceMappingURL=Slice.js.map