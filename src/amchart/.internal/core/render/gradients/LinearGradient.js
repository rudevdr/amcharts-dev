import { Gradient } from "./Gradient";
import { Color } from "../../util/Color";
import * as $array from "../../util/Array";
import * as $type from "../../util/Type";
import * as $math from "../../util/Math";
/**
 * Linear gradient.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/gradients/} for more info
 */
export class LinearGradient extends Gradient {
    /**
     * @ignore
     */
    getFill(target) {
        const rotation = this.get("rotation", 0);
        let bounds = this.getBounds(target);
        let l = bounds.left || 0;
        let r = bounds.right || 0;
        let t = bounds.top || 0;
        let b = bounds.bottom || 0;
        let cos = $math.cos(rotation);
        let sin = $math.sin(rotation);
        let w = cos * (r - l);
        let h = sin * (b - t);
        let longer = Math.max(w, h);
        const gradient = this._root._renderer.createLinearGradient(l, t, l + longer * cos, t + longer * sin);
        const stops = this.get("stops");
        if (stops) {
            let i = 0;
            $array.each(stops, (stop) => {
                let offset = stop.offset;
                if (!$type.isNumber(offset)) {
                    offset = i / (stops.length - 1);
                }
                let opacity = stop.opacity;
                if (!$type.isNumber(opacity)) {
                    opacity = 1;
                }
                let color = stop.color;
                if (color) {
                    const lighten = stop.lighten;
                    if (lighten) {
                        color = Color.lighten(color, lighten);
                    }
                    const brighten = stop.brighten;
                    if (brighten) {
                        color = Color.brighten(color, brighten);
                    }
                    gradient.addColorStop(offset, 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + opacity + ')');
                }
                i++;
            });
        }
        return gradient;
    }
}
Object.defineProperty(LinearGradient, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "LinearGradient"
});
Object.defineProperty(LinearGradient, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Gradient.classNames.concat([LinearGradient.className])
});
//# sourceMappingURL=LinearGradient.js.map