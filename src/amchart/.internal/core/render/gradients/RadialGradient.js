import { Gradient } from "./Gradient";
import { Color } from "../../util/Color";
import * as $array from "../../util/Array";
import * as $type from "../../util/Type";
import * as $utils from "../../util/Utils";
/**
 * Radial gradient.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/gradients/} for more info
 */
export class RadialGradient extends Gradient {
    /**
     * @ignore
     */
    getFill(target) {
        const bounds = this.getBounds(target);
        let x = 0;
        let y = 0;
        let l = bounds.left || 0;
        let r = bounds.right || 0;
        let t = bounds.top || 0;
        let b = bounds.bottom || 0;
        const width = r - l;
        const height = b - t;
        let radius = target.get("radius");
        if ($type.isNumber(radius)) {
            x = 0;
            y = 0;
        }
        else {
            radius = Math.min(width, height) / 2;
            x = width / 2;
            y = height / 2;
        }
        let ux = this.get("x");
        let uy = this.get("y");
        if (ux != null) {
            x = $utils.relativeToValue(ux, width);
        }
        if (uy != null) {
            y = $utils.relativeToValue(uy, height);
        }
        const gradient = this._root._renderer.createRadialGradient(x, y, 0, x, y, radius);
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
Object.defineProperty(RadialGradient, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "RadialGradient"
});
Object.defineProperty(RadialGradient, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Gradient.classNames.concat([RadialGradient.className])
});
//# sourceMappingURL=RadialGradient.js.map