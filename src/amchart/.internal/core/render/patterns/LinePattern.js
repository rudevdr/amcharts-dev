import { Pattern } from "./Pattern";
import * as $type from "../../util//Type";
/**
 * Line pattern.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/patterns/} for more info
 */
export class LinePattern extends Pattern {
    _beforeChanged() {
        super._beforeChanged();
        if (this.isDirty("gap")) {
            this._clear = true;
        }
    }
    _draw() {
        super._draw();
        const w = this.get("width", 100);
        const h = this.get("height", 100);
        const gap = this.get("gap", 0);
        const strokeWidth = this.get("strokeWidth", 1);
        if (!gap) {
            this._display.moveTo(0, 0);
            this._display.lineTo(w, 0);
        }
        else {
            let step = gap + strokeWidth;
            let count = h / step;
            for (let i = -count; i < count * 2; i++) {
                const y = Math.round(i * step - step / 2) + 0.5;
                this._display.moveTo(-w, y);
                this._display.lineTo(w * 2, y);
            }
        }
        this._display.lineStyle(strokeWidth, this.get("color"), this.get("colorOpacity"));
        let strokeDasharray = this.get("strokeDasharray");
        if ($type.isNumber(strokeDasharray)) {
            if (strokeDasharray < 0.5) {
                strokeDasharray = [0];
            }
            else {
                strokeDasharray = [strokeDasharray];
            }
        }
        this._display.setLineDash(strokeDasharray);
        const strokeDashoffset = this.get("strokeDashoffset");
        if (strokeDashoffset) {
            this._display.setLineDashOffset(strokeDashoffset);
        }
        this._display.endStroke();
    }
}
Object.defineProperty(LinePattern, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "LinePattern"
});
Object.defineProperty(LinePattern, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Pattern.classNames.concat([LinePattern.className])
});
//# sourceMappingURL=LinePattern.js.map