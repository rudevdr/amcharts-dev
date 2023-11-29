import { Pattern } from "./Pattern";
import * as $math from "../../util/Math";
/**
 * Circle pattern.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/patterns/} for more info
 */
export class CirclePattern extends Pattern {
    _beforeChanged() {
        super._beforeChanged();
        if (this.isDirty("gap")) {
            this._clear = true;
        }
    }
    _draw() {
        super._draw();
        const checkered = this.get("checkered", false);
        const centered = this.get("centered", true);
        const gap = this.get("gap", 0);
        const rotation = this.get("rotation", 0);
        let w = this.get("width", 100);
        let h = this.get("height", 100);
        let radius = this.get("radius", 3);
        let cellW = radius * 2 + gap;
        let cellH = radius * 2 + gap;
        let cols = Math.round(w / cellW);
        let rows = Math.round(h / cellH);
        cellW = w / cols;
        cellH = h / rows;
        if (rotation != 0) {
            // @todo this is probably not right
            this._display.x = cellW * $math.cos(rotation);
            this._display.y = cellH * $math.sin(rotation);
        }
        const color = this.get("color");
        const colorOpacity = this.get("colorOpacity");
        if (color || colorOpacity) {
            this._display.beginFill(color, colorOpacity);
        }
        for (let r = rotation == 0 ? 0 : -rows * 2; r < rows * 2; r++) {
            for (let c = rotation == 0 ? 0 : -cols * 2; c < cols * 2; c++) {
                if (!checkered || ((r & 1) != 1 && (c & 1) != 1) || ((r & 1) == 1 && (c & 1) == 1)) {
                    let x = c * cellW;
                    let y = r * cellH;
                    if (centered) {
                        x += cellW + gap / 2;
                        y += cellH + gap / 2;
                    }
                    this._display.drawCircle(x - radius, y - radius, radius);
                }
            }
        }
        if (checkered) {
            w = w / 2 - gap * 2;
            h = h / 2 - gap * 2;
        }
        else {
            w -= gap;
            h -= gap;
        }
        if (color || colorOpacity) {
            this._display.endFill();
        }
    }
}
Object.defineProperty(CirclePattern, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "CirclePattern"
});
Object.defineProperty(CirclePattern, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Pattern.classNames.concat([CirclePattern.className])
});
//# sourceMappingURL=CirclePattern.js.map