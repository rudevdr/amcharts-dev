import { ChartIndicator } from "./ChartIndicator";
import { LineSeries } from "../../xy/series/LineSeries";
import * as $array from "../../../core/util/Array";
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export class DisparityIndex extends ChartIndicator {
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
                }, {
                    key: "movingAverageType",
                    name: this.root.language.translateAny("Moving Average Type"),
                    type: "dropdown",
                    options: ["simple", "weighted", "exponential", "dema", "tema"]
                }]
        });
    }
    _afterNew() {
        this._themeTags.push("disparityindex");
        super._afterNew();
    }
    _createSeries() {
        return this.panel.series.push(LineSeries.new(this._root, {
            themeTags: ["indicator"],
            xAxis: this.xAxis,
            yAxis: this.yAxis,
            valueXField: "valueX",
            valueYField: "disparity",
            stroke: this.get("seriesColor"),
            fill: undefined
        }));
    }
    _prepareChildren() {
        if (this.isDirty("movingAverageType")) {
            this._dataDirty = true;
            this.setCustomData("movingAverageType", this.get("movingAverageType"));
        }
        super._prepareChildren();
    }
    /**
     * @ignore
     */
    prepareData() {
        if (this.series) {
            const dataItems = this.get("stockSeries").dataItems;
            const period = this.get("period", 14);
            const type = this.get("movingAverageType");
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
            $array.each(data, (dataItem) => {
                const ma = dataItem.ma;
                if (ma != null) {
                    dataItem.disparity = 100 * (dataItem.value_y - ma) / ma;
                }
            });
            this.series.data.setAll(data);
        }
    }
}
Object.defineProperty(DisparityIndex, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "DisparityIndex"
});
Object.defineProperty(DisparityIndex, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: ChartIndicator.classNames.concat([DisparityIndex.className])
});
//# sourceMappingURL=DisparityIndex.js.map