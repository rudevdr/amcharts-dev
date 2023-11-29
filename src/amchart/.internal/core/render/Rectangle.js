import { Graphics } from "./Graphics";
/**
 * Draws a rectangle.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/graphics/} for more info
 * @important
 */
export class Rectangle extends Graphics {
    _afterNew() {
        super._afterNew();
        this._display.isMeasured = true;
        this.setPrivateRaw("trustBounds", true);
    }
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
        this._display.drawRect(0, 0, this.width(), this.height());
    }
    _updateSize() {
        this.markDirty();
        this._clear = true;
    }
}
Object.defineProperty(Rectangle, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Rectangle"
});
Object.defineProperty(Rectangle, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Graphics.classNames.concat([Rectangle.className])
});
//# sourceMappingURL=Rectangle.js.map