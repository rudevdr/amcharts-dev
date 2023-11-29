import { Indicator } from "./Indicator";
import { LineSeries } from "../../xy/series/LineSeries";
import * as $array from "../../../core/util/Array";
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export class MovingAverage extends Indicator {
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
                    key: "offset",
                    name: this.root.language.translateAny("Offset"),
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
                }, {
                    key: "type",
                    name: this.root.language.translateAny("Type"),
                    type: "dropdown",
                    options: ["simple", "weighted", "exponential", "dema", "tema"]
                }]
        });
    }
    _prepareChildren() {
        if (this.isDirty("type") || this.isDirty("offset")) {
            this._dataDirty = true;
            this.setCustomData("type", this.get("type"));
            this.setCustomData("offset", this.get("offset", 0));
        }
        super._prepareChildren();
    }
    _afterNew() {
        super._afterNew();
        const stockSeries = this.get("stockSeries");
        const chart = stockSeries.chart;
        if (chart) {
            const series = chart.series.push(LineSeries.new(this._root, {
                valueXField: "valueX",
                valueYField: "ma",
                groupDataDisabled: true,
                calculateAggregates: true,
                xAxis: stockSeries.get("xAxis"),
                yAxis: stockSeries.get("yAxis"),
                themeTags: ["indicator", "movingaverage"],
                name: "MA"
            }));
            series.setPrivate("baseValueSeries", stockSeries);
            this.series = series;
            this._handleLegend(series);
        }
    }
    /**
     * @ignore
     */
    prepareData() {
        if (this.series) {
            let period = this.get("period", 50);
            const type = this.get("type");
            const stockSeries = this.get("stockSeries");
            const dataItems = stockSeries.dataItems;
            let data = this._getDataArray(dataItems);
            switch (type) {
                case "simple":
                    this._sma(data, period, "value_y", "ma");
                    break;
                case "weighted":
                    this._wma(data, period, "value_y", "ma");
                    break;
                case "exponential":
                    this._ema(data, period, "value_y", "ma");
                    break;
                case "dema":
                    this._dema(data, period, "value_y", "ma");
                    break;
                case "tema":
                    this._tema(data, period, "value_y", "ma");
                    break;
            }
            const offset = this.get("offset", 0);
            if (offset != 0) {
                let i = 0;
                const baseDuration = this.series.get("xAxis").baseDuration();
                const len = dataItems.length;
                const firstTime = dataItems[0].get("valueX", 0);
                const lastTime = dataItems[len - 1].get("valueX", 0);
                $array.each(data, (dataItem) => {
                    let newX = 0;
                    if (i + offset >= len) {
                        newX = lastTime + (offset - len + i + 1) * baseDuration;
                    }
                    else if (i + offset < 0) {
                        newX = firstTime + (i + offset) * baseDuration;
                    }
                    else {
                        newX = dataItems[i + offset].get("valueX", 0);
                    }
                    dataItem.valueX = newX;
                    i++;
                });
            }
            this.series.data.setAll(data);
        }
    }
}
Object.defineProperty(MovingAverage, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "MovingAverage"
});
Object.defineProperty(MovingAverage, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Indicator.classNames.concat([MovingAverage.className])
});
//# sourceMappingURL=MovingAverage.js.map