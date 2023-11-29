import { Label } from "../../../core/render/Label";
/**
 * Draws an axis label.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/#Labels} for more info
 * @important
 */
export class AxisLabel extends Label {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_tickPoints", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
    }
}
Object.defineProperty(AxisLabel, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "AxisLabel"
});
Object.defineProperty(AxisLabel, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Label.classNames.concat([AxisLabel.className])
});
//# sourceMappingURL=AxisLabel.js.map