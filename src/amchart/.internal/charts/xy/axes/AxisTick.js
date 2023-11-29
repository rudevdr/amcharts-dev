import { Tick } from "../../../core/render/Tick";
/**
 * Draws an axis tick.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/#Ticks} for more info
 * @important
 */
export class AxisTick extends Tick {
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
Object.defineProperty(AxisTick, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "AxisTick"
});
Object.defineProperty(AxisTick, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Tick.classNames.concat([AxisTick.className])
});
//# sourceMappingURL=AxisTick.js.map