import { LineSeries } from "./LineSeries";
import { curveCardinal } from "d3-shape";
/**
 * Smoothed line series suitable for XY (scatter) charts
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/smoothed-series/} for more info
 */
export class SmoothedXYLineSeries extends LineSeries {
    _afterNew() {
        this._setDefault("curveFactory", curveCardinal.tension(this.get("tension", 0.5)));
        super._afterNew();
    }
    _updateChildren() {
        if (this.isDirty("tension")) {
            this.set("curveFactory", curveCardinal.tension(this.get("tension", 0.5)));
            this._valuesDirty = true;
        }
        super._updateChildren();
    }
}
Object.defineProperty(SmoothedXYLineSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "SmoothedXYLineSeries"
});
Object.defineProperty(SmoothedXYLineSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: LineSeries.classNames.concat([SmoothedXYLineSeries.className])
});
//# sourceMappingURL=SmoothedXYLineSeries.js.map