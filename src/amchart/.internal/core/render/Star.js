import { Graphics } from "./Graphics";
import * as $utils from "../../core/util/Utils";
/**
 * Draws a Star.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/graphics/} for more info
 * @important
 */
export class Star extends Graphics {
    _beforeChanged() {
        super._beforeChanged();
        if (this.isDirty("radius") || this.isDirty("innerRadius") || this.isDirty("spikes")) {
            this._clear = true;
        }
    }
    _changed() {
        super._changed();
        if (this._clear) {
            const display = this._display;
            const r = this.get("radius", 0);
            const ir = $utils.relativeToValue(this.get("innerRadius", 0), r);
            const spikes = this.get("spikes", 0);
            const step = Math.PI / spikes;
            let angle = Math.PI / 2 * 3;
            display.moveTo(0, -r);
            for (let i = 0; i < spikes; i++) {
                display.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
                angle += step;
                display.lineTo(Math.cos(angle) * ir, Math.sin(angle) * ir);
                angle += step;
            }
            display.lineTo(0, -r);
            display.closePath();
        }
    }
}
Object.defineProperty(Star, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Star"
});
Object.defineProperty(Star, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Graphics.classNames.concat([Star.className])
});
//# sourceMappingURL=Star.js.map