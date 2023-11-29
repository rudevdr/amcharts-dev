import { Graphics } from "./Graphics";
import * as $draw from "../util/Draw";
/**
 * Draws a line.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/graphics/} for more info
 * @important
 */
export class Line extends Graphics {
    _beforeChanged() {
        super._beforeChanged();
        if (this.isDirty("points") || this.isDirty("segments") || this._sizeDirty || this.isPrivateDirty("width") || this.isPrivateDirty("height")) {
            this._clear = true;
        }
    }
    _changed() {
        super._changed();
        if (this._clear) {
            const points = this.get("points");
            const segments = this.get("segments");
            if (points && points.length > 0) {
                let point = points[0];
                this._display.moveTo(point.x, point.y);
                $draw.segmentedLine(this._display, [[points]]);
            }
            else if (segments) {
                $draw.segmentedLine(this._display, segments);
            }
            else if (!this.get("draw")) {
                let w = this.width();
                let h = this.height();
                this._display.moveTo(0, 0);
                this._display.lineTo(w, h);
            }
        }
    }
}
Object.defineProperty(Line, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Line"
});
Object.defineProperty(Line, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Graphics.classNames.concat([Line.className])
});
//# sourceMappingURL=Line.js.map