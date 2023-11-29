import { LineSeries } from "./LineSeries";
import { curveMonotoneXTension } from "../../../core/render/MonotoneXTension";
/**
 * Smoothed line series suitable for horizontal plots.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/smoothed-series/} for more info
 */
export class SmoothedXLineSeries extends LineSeries {
    _afterNew() {
        this._setDefault("curveFactory", curveMonotoneXTension(this.get("tension", 0.5)));
        super._afterNew();
    }
    _updateChildren() {
        if (this.isDirty("tension")) {
            this.set("curveFactory", curveMonotoneXTension(this.get("tension", 0.5)));
            this._valuesDirty = true;
        }
        super._updateChildren();
    }
}
Object.defineProperty(SmoothedXLineSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "SmoothedXLineSeries"
});
Object.defineProperty(SmoothedXLineSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: LineSeries.classNames.concat([SmoothedXLineSeries.className])
});
//# sourceMappingURL=SmoothedXLineSeries.js.map