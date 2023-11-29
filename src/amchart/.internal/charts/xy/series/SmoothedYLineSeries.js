import { LineSeries } from "./LineSeries";
import { curveMonotoneYTension } from "../../../core/render/MonotoneYTension";
/**
 * Smoothed line series suitable for vertical plots.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/smoothed-series/} for more info
 */
export class SmoothedYLineSeries extends LineSeries {
    _afterNew() {
        this._setDefault("curveFactory", curveMonotoneYTension(this.get("tension", 0.5)));
        super._afterNew();
    }
    _updateChildren() {
        if (this.isDirty("tension")) {
            this.set("curveFactory", curveMonotoneYTension(this.get("tension", 0.5)));
            this._valuesDirty = true;
        }
        super._updateChildren();
    }
}
Object.defineProperty(SmoothedYLineSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "SmoothedYLineSeries"
});
Object.defineProperty(SmoothedYLineSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: LineSeries.classNames.concat([SmoothedYLineSeries.className])
});
//# sourceMappingURL=SmoothedYLineSeries.js.map