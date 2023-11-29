import * as $type from "../util/Type";
import * as $math from "../util/Math";
import * as $utils from "../util/Utils";
import { Rectangle } from "./Rectangle";
/**
 * Draws a rectangle with rounded corners.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/graphics/} for more info
 * @important
 */
export class RoundedRectangle extends Rectangle {
    _beforeChanged() {
        super._beforeChanged();
        if (this.isDirty("cornerRadiusTL") || this.isDirty("cornerRadiusTR") || this.isDirty("cornerRadiusBR") || this.isDirty("cornerRadiusBL")) {
            this._clear = true;
        }
    }
    _draw() {
        let width = this.width();
        let height = this.height();
        let w = width;
        let h = height;
        let wSign = w / Math.abs(width);
        let hSign = h / Math.abs(height);
        if ($type.isNumber(w) && $type.isNumber(h)) {
            let minSide = Math.min(w, h) / 2;
            let crtl = $utils.relativeToValue(this.get("cornerRadiusTL", 8), minSide);
            let crtr = $utils.relativeToValue(this.get("cornerRadiusTR", 8), minSide);
            let crbr = $utils.relativeToValue(this.get("cornerRadiusBR", 8), minSide);
            let crbl = $utils.relativeToValue(this.get("cornerRadiusBL", 8), minSide);
            let maxcr = Math.min(Math.abs(w / 2), Math.abs(h / 2));
            crtl = $math.fitToRange(crtl, 0, maxcr);
            crtr = $math.fitToRange(crtr, 0, maxcr);
            crbr = $math.fitToRange(crbr, 0, maxcr);
            crbl = $math.fitToRange(crbl, 0, maxcr);
            const display = this._display;
            display.moveTo(crtl * wSign, 0);
            display.lineTo(w - crtr * wSign, 0);
            if (crtr > 0) {
                display.arcTo(w, 0, w, crtr * hSign, crtr);
            }
            display.lineTo(w, h - crbr * hSign);
            if (crbr > 0) {
                display.arcTo(w, h, w - crbr * wSign, h, crbr);
            }
            display.lineTo(crbl * wSign, h);
            if (crbl > 0) {
                display.arcTo(0, h, 0, h - crbl * hSign, crbl);
            }
            display.lineTo(0, crtl * hSign);
            if (crtl > 0) {
                display.arcTo(0, 0, crtl * wSign, 0, crtl);
            }
            display.closePath();
        }
    }
}
Object.defineProperty(RoundedRectangle, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "RoundedRectangle"
});
Object.defineProperty(RoundedRectangle, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Rectangle.classNames.concat([RoundedRectangle.className])
});
//# sourceMappingURL=RoundedRectangle.js.map