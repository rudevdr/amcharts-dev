import { RadialLabel } from "../../../core/render/RadialLabel";
/**
 * Draws a label on a circular axis.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/#Labels} for more info
 */
export class AxisLabelRadial extends RadialLabel {
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
Object.defineProperty(AxisLabelRadial, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "AxisLabelRadial"
});
Object.defineProperty(AxisLabelRadial, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: RadialLabel.classNames.concat([AxisLabelRadial.className])
});
//# sourceMappingURL=AxisLabelRadial.js.map