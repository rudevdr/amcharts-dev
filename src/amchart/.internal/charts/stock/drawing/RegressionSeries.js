import { SimpleLineSeries } from "./SimpleLineSeries";
function round(number, precision) {
    const factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}
// Modified from the regression npm package (under the MIT license)
function linear(data, precision = 2) {
    const sum = [0, 0, 0, 0, 0];
    let len = 0;
    for (let n = 0; n < data.length; n++) {
        if (data[n][1] !== null) {
            len++;
            sum[0] += data[n][0];
            sum[1] += data[n][1];
            sum[2] += data[n][0] * data[n][0];
            sum[3] += data[n][0] * data[n][1];
            sum[4] += data[n][1] * data[n][1];
        }
    }
    const run = ((len * sum[2]) - (sum[0] * sum[0]));
    const rise = ((len * sum[3]) - (sum[0] * sum[1]));
    const gradient = run === 0 ? 0 : round(rise / run, precision);
    const intercept = round((sum[1] / len) - ((gradient * sum[0]) / len), precision);
    function predict(x) {
        return [
            round(x, precision),
            round((gradient * x) + intercept, precision)
        ];
    }
    return data.map(point => predict(point[0]));
}
export class RegressionSeries extends SimpleLineSeries {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "regression"
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
            const xAxis = series.get("xAxis");
            let x1 = this._getXValue(diP1.get("valueX"));
            let x2 = this._getXValue(diP2.get("valueX"));
            const di1 = xAxis.getSeriesItem(series, xAxis.valueToPosition(x1));
            const di2 = xAxis.getSeriesItem(series, xAxis.valueToPosition(x2));
            const field = this.get("field") + "Y";
            if (di1 && di2) {
                const dataItems = series.dataItems;
                let startIndex = dataItems.indexOf(di1);
                let endIndex = dataItems.indexOf(di2);
                let inversed = false;
                if (startIndex > endIndex) {
                    inversed = true;
                    [startIndex, endIndex] = [endIndex, startIndex];
                }
                const points = [];
                let ii = 0;
                for (let i = startIndex; i <= endIndex; i++) {
                    const dataItem = dataItems[i];
                    points.push([ii, dataItem.get(field)]);
                    ii++;
                }
                const resultPoints = linear(points);
                const len = resultPoints.length;
                if (len > 1) {
                    const p1 = resultPoints[0];
                    const p2 = resultPoints[resultPoints.length - 1];
                    if (p1 && p2) {
                        let y1 = p1[1];
                        let y2 = p2[1];
                        if (inversed) {
                            [y1, y2] = [y2, y1];
                        }
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
    }
}
Object.defineProperty(RegressionSeries, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "RegressionSeries"
});
Object.defineProperty(RegressionSeries, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: SimpleLineSeries.classNames.concat([RegressionSeries.className])
});
//# sourceMappingURL=RegressionSeries.js.map