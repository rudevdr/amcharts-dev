import { Graphics } from "./Graphics";
/**
 * Draws a triangle.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/graphics/} for more info
 * @important
 */
export class Triangle extends Graphics {
    _beforeChanged() {
        super._beforeChanged();
        if (this.isDirty("width") || this.isDirty("height") || this.isPrivateDirty("width") || this.isPrivateDirty("height")) {
            this._clear = true;
        }
    }
    _changed() {
        super._changed();
        if (this._clear && !this.get("draw")) {
            this._draw();
        }
    }
    _draw() {
        const w = this.width();
        const h = this.height();
        const display = this._display;
        display.moveTo(-w / 2, h / 2);
        display.lineTo(0, -h / 2);
        display.lineTo(w / 2, h / 2);
        display.lineTo(-w / 2, h / 2);
        display.closePath();
    }
    _updateSize() {
        this.markDirty();
        this._clear = true;
    }
}
Object.defineProperty(Triangle, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Triangle"
});
Object.defineProperty(Triangle, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Graphics.classNames.concat([Triangle.className])
});
//# sourceMappingURL=Triangle.js.map