import { OverboughtOversold } from "./OverboughtOversold";
import { LineSeries } from "../../xy/series/LineSeries";
import * as $array from "../../../core/util/Array";
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export class RelativeStrengthIndex extends OverboughtOversold {
    constructor() {
        super(...arguments);
        /**
         * Indicator series.
         */
        Object.defineProperty(this, "smaSeries", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    _afterNew() {
        this._themeTags.push("rsi");
        super._afterNew();
        this._editableSettings.unshift({
            key: "period",
            name: this.root.language.translateAny("Period"),
            type: "number"
        }, {
            key: "seriesColor",
            name: this.root.language.translateAny("Period"),
            type: "color"
        }, {
            key: "field",
            name: this.root.language.translateAny("Field"),
            type: "dropdown",
            options: ["open", "close", "low", "high", "hl/2", "hlc/3", "hlcc/4", "ohlc/4"]
        }, {
            key: "smaPeriod",
            name: this.root.language.translateAny("SMA period"),
            type: "number"
        }, {
            key: "smaColor",
            name: this.root.language.translateAny("SMA period"),
            type: "color"
        });
        const smaSeries = this.panel.series.push(LineSeries.new(this._root, {
            valueXField: "valueX",
            valueYField: "sma",
            xAxis: this.xAxis,
            yAxis: this.yAxis,
            groupDataDisabled: true,
            themeTags: ["indicator", "sma"]
        }));
        this.smaSeries = smaSeries;
    }
    _updateChildren() {
        super._updateChildren();
        if (this.isDirty("smaColor")) {
            this._updateSeriesColor(this.smaSeries, this.get("smaColor"), "smaColor");
        }
        if (this.isDirty("smaPeriod")) {
            this._dataDirty = true;
            this.setCustomData("smaPeriod", this.get("smaPeriod"));
        }
    }
    /**
     * @ignore
     */
    prepareData() {
        if (this.series) {
            const dataItems = this.get("stockSeries").dataItems;
            let period = this.get("period", 14);
            const data = [];
            let i = 0;
            let averageGain = 0;
            let averageLoss = 0;
            let prevAverageGain = 0;
            let prevAverageLoss = 0;
            $array.each(dataItems, (dataItem) => {
                let rsi = null;
                i++;
                if (i == period + 1) {
                    for (let j = 1; j <= period; j++) {
                        let value = this._getValue(dataItems[j]);
                        let prevValue = this._getValue(dataItems[j - 1]);
                        if (value != undefined && prevValue != undefined) {
                            let change = value - prevValue;
                            if (change > 0) {
                                averageGain += change / period;
                            }
                            else {
                                averageLoss += Math.abs(change) / period;
                            }
                        }
                    }
                    rsi = 100 - (100 / (1 + averageGain / averageLoss));
                }
                else if (i > period) {
                    let value = this._getValue(dataItem);
                    let prevValue = this._getValue(dataItems[i - 2]);
                    if (value != null && prevValue != null) {
                        let change = value - prevValue;
                        let gain = 0;
                        let loss = 0;
                        if (change > 0) {
                            gain = change;
                        }
                        else {
                            loss = -change;
                        }
                        averageGain = (prevAverageGain * (period - 1) + gain) / period;
                        averageLoss = (prevAverageLoss * (period - 1) + loss) / period;
                        rsi = 100 - (100 / (1 + averageGain / averageLoss));
                    }
                }
                data.push({ valueX: dataItem.get("valueX"), valueS: rsi });
                prevAverageGain = averageGain;
                prevAverageLoss = averageLoss;
            });
            this.series.data.setAll(data);
            period = this.get("smaPeriod", 3);
            this._sma(data, period, "valueS", "sma");
            this.series.data.setAll(data);
            this.smaSeries.data.setAll(data);
        }
    }
}
Object.defineProperty(RelativeStrengthIndex, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "RelativeStrengthIndex"
});
Object.defineProperty(RelativeStrengthIndex, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: OverboughtOversold.classNames.concat([RelativeStrengthIndex.className])
});
//# sourceMappingURL=RelativeStrengthIndex.js.map