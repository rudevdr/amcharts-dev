import { Color } from "../../../core/util/Color";
import { ChartIndicator } from "./ChartIndicator";
import { ColumnSeries } from "../../xy/series/ColumnSeries";
import * as $array from "../../../core/util/Array";
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export class MovingAverageDeviation extends ChartIndicator {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_editableSettings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                {
                    key: "period",
                    name: this.root.language.translateAny("Period"),
                    type: "number"
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
                }, {
                    key: "unit",
                    name: this.root.language.translateAny("Points/Percent"),
                    type: "dropdown",
                    options: ["points", "percent"]
                },
                {
                    key: "increasingColor",
                    name: this.root.language.translateAny("Increasing"),
                    type: "color"
                }, {
                    key: "decreasingColor",
                    name: this.root.language.translateAny("Decreasing"),
                    type: "color"
                }
            ]
        });
    }
    _afterNew() {
        this._themeTags.push("movingaveragedeviation");
        super._afterNew();
    }
    _createSeries() {
        return this.panel.series.push(ColumnSeries.new(this._root, {
            themeTags: ["indicator"],
            xAxis: this.xAxis,
            yAxis: this.yAxis,
            valueXField: "valueX",
            valueYField: "deviation",
            fill: undefined
        }));
    }
    _updateChildren() {
        super._updateChildren();
        if (this.isDirty("increasingColor") || this.isDirty("decreasingColor")) {
            const template = this.series.columns.template;
            const increasing = this.get("increasingColor");
            const decreasing = this.get("decreasingColor");
            template.states.create("riseFromPrevious", { fill: increasing, stroke: increasing });
            template.states.create("dropFromPrevious", { fill: decreasing, stroke: decreasing });
        }
    }
    _prepareChildren() {
        if (this.isDirty("type") || this.isDirty("unit")) {
            this._dataDirty = true;
        }
        super._prepareChildren();
    }
    /**
     * @ignore
     */
    prepareData() {
        if (this.series) {
            const dataItems = this.get("stockSeries").dataItems;
            let decreasingColor = this.get("decreasingColor", Color.fromHex(0xff0000)).toCSSHex();
            let increasingColor = this.get("increasingColor", Color.fromHex(0x00ff00)).toCSSHex();
            let data = this._getDataArray(dataItems);
            let period = this.get("period", 50);
            const type = this.get("type");
            const unit = this.get("unit");
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
            let previous = -Infinity;
            let i = 0;
            $array.each(data, (dataItem) => {
                i++;
                if (i >= period) {
                    let deviation = dataItem.value_y - dataItem.ma;
                    if (unit == "percent") {
                        deviation = (dataItem.value_y / dataItem.ma - 1) * 100;
                    }
                    let color = increasingColor;
                    if (deviation < previous) {
                        color = decreasingColor;
                    }
                    dataItem.deviation = deviation;
                    dataItem.deviationColor = color;
                    previous = deviation;
                }
            });
            this.series.data.setAll(data);
        }
    }
}
Object.defineProperty(MovingAverageDeviation, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "MovingAverageDeviation"
});
Object.defineProperty(MovingAverageDeviation, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: ChartIndicator.classNames.concat([MovingAverageDeviation.className])
});
//# sourceMappingURL=MovingAverageDeviation.js.map