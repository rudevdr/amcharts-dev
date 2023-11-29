import { RadarLineSeries } from "./RadarLineSeries";
import { curveCardinalClosed, curveCardinal } from "d3-shape";
/**
 * Draws a smoothed line series for use in a [[RadarChart]].
 *
 * @important
 */
export class SmoothedRadarLineSeries extends RadarLineSeries {
    _afterNew() {
        this._setDefault("curveFactory", curveCardinalClosed.tension(this.get("tension", 0)));
        super._afterNew();
    }
    _prepareChildren() {
        super._prepareChildren();
        if (this.isDirty("connectEnds")) {
            const connectEnds = this.get("connectEnds");
            if (connectEnds) {
                this.setRaw("curveFactory", curveCardinalClosed.tension(this.get("tension", 0)));
            }
            else {
                this.setRaw("curveFactory", curveCardinal.tension(this.get("tension", 0)));
            }
        }
        if (this.isDirty("tension")) {
            let cf = this.get("curveFactory");
            if (cf) {
                cf.tension(this.get("tension", 0));
            }
        }
    }
    _endLine(_points, _firstPoint) {
    }
}
Object.defineProperty(SmoothedRadarLineSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "SmoothedRadarLineSeries"
});
Object.defineProperty(SmoothedRadarLineSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: RadarLineSeries.classNames.concat([SmoothedRadarLineSeries.className])
});
//# sourceMappingURL=SmoothedRadarLineSeries.js.map