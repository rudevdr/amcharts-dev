import { SimpleLineSeries } from "./SimpleLineSeries";
export class AverageSeries extends SimpleLineSeries {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "average"
        });
    }
    _afterNew() {
        super._afterNew();
        this.setPrivate("allowChangeSnap", false);
        this.set("snapToData", true);
    }
    _updateSegment(index) {
        const dataPoints = this._di[index];
        if (dataPoints) {
            const diP1 = this._di[index]["p1"];
            const diP2 = this._di[index]["p2"];
            const series = this.get("series");
            if (series && diP1 && diP2) {
                let x1 = this._getXValue(diP1.get("valueX"));
                let x2 = this._getXValue(diP2.get("valueX"));
                const xAxis = this.get("xAxis");
                const di1 = xAxis.getSeriesItem(series, Math.max(0, xAxis.valueToPosition(x1)));
                const di2 = xAxis.getSeriesItem(series, Math.min(1, xAxis.valueToPosition(x2)));
                const field = this.get("field") + "Y";
                if (di1 && di2) {
                    let i1 = series.dataItems.indexOf(di1);
                    let i2 = series.dataItems.indexOf(di2);
                    if (i1 > i2) {
                        [i1, i2] = [i2, i1];
                    }
                    let sum = 0;
                    let count = 0;
                    for (let i = i1; i <= i2; i++) {
                        const di = series.dataItems[i];
                        const value = di.get(field);
                        if (value != null) {
                            sum += value;
                            count++;
                        }
                    }
                    const average = sum / count;
                    diP1.set("valueX", x1);
                    diP2.set("valueX", x2);
                    this._setContext(diP1, "valueX", x1);
                    this._setContext(diP2, "valueX", x2);
                    this._setContext(diP1, "valueY", average, true);
                    this._setContext(diP2, "valueY", average, true);
                    this._positionBullets(diP1);
                    this._positionBullets(diP2);
                }
            }
            this._updateElements();
        }
    }
}
Object.defineProperty(AverageSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "AverageSeries"
});
Object.defineProperty(AverageSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: SimpleLineSeries.classNames.concat([AverageSeries.className])
});
//# sourceMappingURL=AverageSeries.js.map