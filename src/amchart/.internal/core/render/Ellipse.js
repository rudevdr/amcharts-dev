import { Graphics } from "./Graphics";
/**
 * Draws a Ellipse.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/graphics/} for more info
 * @important
 */
export class Ellipse extends Graphics {
    _beforeChanged() {
        super._beforeChanged();
        if (this.isDirty("radiusX") || this.isDirty("radiusY") || this.isDirty("rotation")) {
            this._clear = true;
        }
    }
    _changed() {
        super._changed();
        if (this._clear) {
            this._display.drawEllipse(0, 0, Math.abs(this.get("radiusX")), Math.abs(this.get("radiusY")));
        }
    }
}
Object.defineProperty(Ellipse, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Ellipse"
});
Object.defineProperty(Ellipse, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Graphics.classNames.concat([Ellipse.className])
});
//# sourceMappingURL=Ellipse.js.map