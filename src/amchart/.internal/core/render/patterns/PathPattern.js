import { Pattern } from "./Pattern";
/**
 * A pattern that uses an SVG path.
 *
 * @since 5.2.33
 * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/patterns/} for more info
 */
export class PathPattern extends Pattern {
    _beforeChanged() {
        super._beforeChanged();
        if (this.isDirty("svgPath")) {
            this._clear = true;
        }
    }
    _draw() {
        super._draw();
        // const checkered = this.get("checkered", false);
        // const centered = this.get("centered", true);
        // const gap = this.get("gap", 0);
        // const rotation = this.get("rotation", 0);
        // let w = this.get("width", 100);
        // let h = this.get("height", 100);
        // let rectW = this.get("maxWidth", 5);
        // let rectH = this.get("maxHeight", 5);
        // let cellW = rectW + gap;
        // let cellH = rectH + gap;
        // let cols = Math.round(w / cellW);
        // let rows = Math.round(h / cellH);
        // cellW = w / cols;
        // cellH = h / rows;
        // if (rotation != 0) {
        // 	// @todo this is probably not right
        // 	this._display.x = cellW / 2 * $math.cos(rotation);
        // 	this._display.y = -cellH / 2 * $math.sin(rotation);
        // }
        // for (let r = rotation == 0 ? 0 : -rows * 2; r < rows * 2; r++) {
        // 	for (let c = rotation == 0 ? 0 : -cols * 2; c < cols * 2; c++) {
        // 		if (!checkered || ((r & 1) != 1 && (c & 1) != 1) || ((r & 1) == 1 && (c & 1) == 1)) {
        // 			let x = c * cellW;
        // 			let y = r * cellH;
        // 			if (centered) {
        // 				x += (cellW - rectW) / 2;
        // 				y += (cellH - rectH) / 2;
        // 			}
        // 			this._display.drawRect(x, y, rectW, rectH);
        // 		}
        // 	}
        // }
        // if (checkered) {
        // 	w = w / 2 - gap * 2;
        // 	h = h / 2 - gap * 2;
        // }
        // else {
        // 	w -= gap;
        // 	h -= gap;
        // }
        const svgPath = this.get("svgPath");
        if (svgPath != null) {
            this._display.svgPath(svgPath);
        }
        const color = this.get("color");
        const colorOpacity = this.get("colorOpacity");
        if (color || colorOpacity) {
            // this._display.lineStyle(strokeWidth, stroke, colorOpacity);
            // this._display.endStroke();
            this._display.beginFill(color, colorOpacity);
            this._display.endFill();
        }
    }
}
Object.defineProperty(PathPattern, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "PathPattern"
});
Object.defineProperty(PathPattern, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Pattern.classNames.concat([PathPattern.className])
});
//# sourceMappingURL=PathPattern.js.map