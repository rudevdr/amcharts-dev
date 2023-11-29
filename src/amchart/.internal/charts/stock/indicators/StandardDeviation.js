import { ChartIndicator } from "./ChartIndicator";
import { LineSeries } from "../../xy/series/LineSeries";
import * as $array from "../../../core/util/Array";
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export class StandardDeviation extends ChartIndicator {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_editableSettings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [{
                    key: "period",
                    name: this.root.language.translateAny("Period"),
                    type: "number"
                }, {
                    key: "seriesColor",
                    name: this.root.language.translateAny("Color"),
                    type: "color"
                }, {
                    key: "field",
                    name: this.root.language.translateAny("Field"),
                    type: "dropdown",
                    options: ["open", "close", "low", "high", "hl/2", "hlc/3", "hlcc/4", "ohlc/4"]
                }]
        });
    }
    _afterNew() {
        this._themeTags.push("standarddeviation");
        super._afterNew();
    }
    _createSeries() {
        return this.panel.series.push(LineSeries.new(this._root, {
            themeTags: ["indicator"],
            xAxis: this.xAxis,
            yAxis: this.yAxis,
            valueXField: "valueX",
            valueYField: "deviation",
            fill: undefined
        }));
    }
    /**
     * @ignore
     */
    prepareData() {
        super.prepareData();
        if (this.series) {
            let period = this.get("period", 20);
            const stockSeries = this.get("stockSeries");
            const dataItems = stockSeries.dataItems;
            let data = this._getDataArray(dataItems);
            this._sma(data, period, "value_y", "ma");
            let i = 0;
            $array.each(data, (dataItem) => {
                if (i >= period - 1) {
                    let mean = dataItem.ma;
                    let stdSum = 0;
                    for (let j = i - period + 1; j <= i; j++) {
                        let di = dataItems[j];
                        let diValue = this._getValue(di);
                        if (diValue != null) {
                            stdSum += Math.pow(diValue - mean, 2);
                        }
                    }
                    let std = Math.sqrt(stdSum / period);
                    dataItem.deviation = std;
                }
                i++;
            });
            this.series.data.setAll(data);
        }
    }
}
Object.defineProperty(StandardDeviation, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "StandardDeviation"
});
Object.defineProperty(StandardDeviation, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: ChartIndicator.classNames.concat([StandardDeviation.className])
});
//# sourceMappingURL=StandardDeviation.js.map