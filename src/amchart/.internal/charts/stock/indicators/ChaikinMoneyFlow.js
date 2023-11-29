import { ChartIndicator } from "./ChartIndicator";
import { LineSeries } from "../../xy/series/LineSeries";
import * as $array from "../../../core/util/Array";
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export class ChaikinMoneyFlow extends ChartIndicator {
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
                }]
        });
    }
    _afterNew() {
        this._themeTags.push("chaikinmoneyflow");
        super._afterNew();
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
        if (this.isDirty("volumeSeries")) {
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
            const volumeSeries = this.get("volumeSeries");
            this.setRaw("field", "close");
            let data = this._getDataArray(dataItems);
            let i = 0;
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
                    let mfv = mf * volume;
                    data[i].mfv = mfv;
                    data[i].volume = volume;
                }
                i++;
            });
            const period = this.get("period", 20);
            i = 0;
            $array.each(data, (dataItem) => {
                if (i >= period - 1) {
                    let mfv = 0;
                    let volume = 0;
                    for (let j = i; j > i - period; j--) {
                        mfv += data[j].mfv;
                        volume += data[j].volume;
                    }
                    dataItem.cmf = mfv / volume;
                }
                i++;
            });
            this.series.data.setAll(data);
        }
    }
}
Object.defineProperty(ChaikinMoneyFlow, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "ChaikinMoneyFlow"
});
Object.defineProperty(ChaikinMoneyFlow, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: ChartIndicator.classNames.concat([ChaikinMoneyFlow.className])
});
//# sourceMappingURL=ChaikinMoneyFlow.js.map