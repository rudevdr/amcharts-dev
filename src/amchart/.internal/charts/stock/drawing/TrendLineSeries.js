import { SimpleLineSeries } from "./SimpleLineSeries";
export class TrendLineSeries extends SimpleLineSeries {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "trendline"
        });
    }
    _afterNew() {
        super._afterNew();
        this.setPrivate("allowChangeSnap", false);
        this.set("snapToData", true);
    }
    _updateSegment(index) {
        const diP1 = this._di[index]["p1"];
        const diP2 = this._di[index]["p2"];
        const series = this.get("series");
        if (series && diP1 && diP2) {
            const xAxis = this.get("xAxis");
            let x1 = this._getXValue(diP1.get("valueX"));
            let x2 = this._getXValue(diP2.get("valueX"));
            const di1 = xAxis.getSeriesItem(series, Math.max(0, xAxis.valueToPosition(x1)));
            const di2 = xAxis.getSeriesItem(series, Math.min(1, xAxis.valueToPosition(x2)));
            const field = this.get("field") + "Y";
            if (di1 && di2) {
                let y1 = di1.get(field);
                let y2 = di2.get(field);
                this._setContext(diP1, "valueY", y1, true);
                this._setContext(diP2, "valueY", y2, true);
                this._setContext(diP1, "valueX", x1);
                this._setContext(diP2, "valueX", x2);
                this._positionBullets(diP1);
                this._positionBullets(diP2);
            }
        }
    }
}
Object.defineProperty(TrendLineSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "TrendLineSeries"
});
Object.defineProperty(TrendLineSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: SimpleLineSeries.classNames.concat([TrendLineSeries.className])
});
//# sourceMappingURL=TrendLineSeries.js.map