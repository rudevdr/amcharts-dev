import { ChartIndicator } from "./ChartIndicator";
import { LineSeries } from "../../xy/series/LineSeries";
import * as $array from "../../../core/util/Array";
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export class AccumulationDistribution extends ChartIndicator {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_editableSettings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [{
                    key: "seriesColor",
                    name: this.root.language.translateAny("Color"),
                    type: "color"
                }, {
                    key: "useVolume",
                    name: this.root.language.translateAny("Use Volume"),
                    type: "checkbox"
                }]
        });
    }
    _afterNew() {
        this._themeTags.push("accumulationdistribution");
        super._afterNew();
        this.yAxis.set("numberFormat", "#.###a");
    }
    _createSeries() {
        return this.panel.series.push(LineSeries.new(this._root, {
            themeTags: ["indicator"],
            xAxis: this.xAxis,
            yAxis: this.yAxis,
            valueXField: "valueX",
            valueYField: "ad",
            stroke: this.get("seriesColor"),
            fill: undefined
        }));
    }
    _prepareChildren() {
        if (this.isDirty("useVolume") || this.isDirty("volumeSeries")) {
            this._dataDirty = true;
            this.setCustomData("useVolume", this.get("useVolume") ? "Y" : "N");
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
            let useVolume = this.get("useVolume");
            $array.each(dataItems, (dataItem) => {
                let close = dataItem.get("valueY");
                if (close != null) {
                    let low = dataItem.get("lowValueY", close);
                    let high = dataItem.get("highValueY", close);
                    let volume = 1;
                    if (volumeSeries && useVolume) {
                        const volumeDI = volumeSeries.dataItems[i];
                        if (volumeDI) {
                            volume = volumeDI.get("valueY", 1);
                        }
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
            this.series.data.setAll(data);
        }
    }
}
Object.defineProperty(AccumulationDistribution, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "AccumulationDistribution"
});
Object.defineProperty(AccumulationDistribution, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: ChartIndicator.classNames.concat([AccumulationDistribution.className])
});
//# sourceMappingURL=AccumulationDistribution.js.map