import { ChartIndicator } from "./ChartIndicator";
import { LineSeries } from "../../xy/series/LineSeries";
import * as $array from "../../../core/util/Array";
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export class ChaikinOscillator extends ChartIndicator {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_editableSettings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [{
                    key: "period",
                    name: this.root.language.translateAny("Fast period"),
                    type: "number"
                }, {
                    key: "slowPeriod",
                    name: this.root.language.translateAny("Slow period"),
                    type: "number"
                }, {
                    key: "seriesColor",
                    name: this.root.language.translateAny("Color"),
                    type: "color"
                }]
        });
    }
    _afterNew() {
        this._themeTags.push("chaikinoscillator");
        super._afterNew();
        this.yAxis.set("numberFormat", "#.###a");
    }
    _createSeries() {
        return this.panel.series.push(LineSeries.new(this._root, {
            themeTags: ["indicator"],
            xAxis: this.xAxis,
            yAxis: this.yAxis,
            valueXField: "valueX",
            valueYField: "cmf",
            stroke: this.get("seriesColor"),
            fill: undefined
        }));
    }
    _prepareChildren() {
        if (this.isDirty("volumeSeries") || this.isDirty("slowPeriod")) {
            this._dataDirty = true;
            this.setCustomData("slowPeriod", this.get("slowPeriod"));
        }
        super._prepareChildren();
    }
    /**
     * @ignore
     */
    prepareData() {
        if (this.series) {
            const dataItems = this.get("stockSeries").dataItems;
            const volumeSeries = this.get("volumeSeries");
            this.setRaw("field", "close");
            let i = 0;
            let data = this._getDataArray(dataItems);
            let prevAD = 0;
            $array.each(dataItems, (dataItem) => {
                let close = dataItem.get("valueY");
                if (close != null) {
                    let low = dataItem.get("lowValueY", close);
                    let high = dataItem.get("highValueY", close);
                    let volume = 1;
                    const volumeDI = volumeSeries.dataItems[i];
                    if (volumeDI) {
                        volume = volumeDI.get("valueY", 1);
                    }
                    let mf = ((close - low) - (high - close)) / (high - low);
                    if (high == low) {
                        mf = 0;
                    }
                    let ad = prevAD + mf * volume;
                    data[i].ad = ad;
                    prevAD = ad;
                }
                i++;
            });
            this._ema(data, this.get("slowPeriod", 10), "ad", "emaSlow");
            this._ema(data, this.get("period", 3), "ad", "emaFast");
            $array.each(data, (dataItem) => {
                const emaSlow = dataItem.emaSlow;
                const emaFast = dataItem.emaFast;
                if (emaSlow != null && emaFast != null) {
                    dataItem.cmf = emaFast - emaSlow;
                }
            });
            this.series.data.setAll(data);
        }
    }
}
Object.defineProperty(ChaikinOscillator, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "ChaikinOscillator"
});
Object.defineProperty(ChaikinOscillator, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: ChartIndicator.classNames.concat([ChaikinOscillator.className])
});
//# sourceMappingURL=ChaikinOscillator.js.map