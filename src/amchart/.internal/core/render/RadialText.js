import { Text } from "./Text";
import * as $math from "../util/Math";
/**
 * @ignore
 */
export class RadialText extends Text {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_display", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this._root._renderer.makeRadialText("", this.textStyle)
        });
    }
    _afterNew() {
        super._afterNew();
    }
    _beforeChanged() {
        super._beforeChanged();
        this._display.clear();
        if (this.isDirty("textType")) {
            this._display.textType = this.get("textType");
            this.markDirtyBounds();
        }
        if (this.isDirty("radius")) {
            this._display.radius = this.get("radius");
            this.markDirtyBounds();
        }
        if (this.isDirty("startAngle")) {
            this._display.startAngle = (this.get("startAngle", 0) + 90) * $math.RADIANS;
            this.markDirtyBounds();
        }
        if (this.isDirty("inside")) {
            this._display.inside = this.get("inside");
            this.markDirtyBounds();
        }
        if (this.isDirty("orientation")) {
            this._display.orientation = this.get("orientation");
            this.markDirtyBounds();
        }
        if (this.isDirty("kerning")) {
            this._display.kerning = this.get("kerning");
            this.markDirtyBounds();
        }
    }
}
Object.defineProperty(RadialText, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "RadialText"
});
Object.defineProperty(RadialText, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Text.classNames.concat([RadialText.className])
});
//# sourceMappingURL=RadialText.js.map