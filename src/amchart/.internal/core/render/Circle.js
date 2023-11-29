import { Graphics } from "./Graphics";
/**
 * Draws a circle.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/graphics/} for more info
 * @important
 */
export class Circle extends Graphics {
    _afterNew() {
        super._afterNew();
        this._display.isMeasured = true;
        this.setPrivateRaw("trustBounds", true);
    }
    _beforeChanged() {
        super._beforeChanged();
        if (this.isDirty("radius")) {
            this._clear = true;
        }
    }
    _changed() {
        super._changed();
        if (this._clear) {
            this._display.drawCircle(0, 0, this.get("radius", 10));
        }
    }
}
Object.defineProperty(Circle, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Circle"
});
Object.defineProperty(Circle, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Graphics.classNames.concat([Circle.className])
});
//# sourceMappingURL=Circle.js.map