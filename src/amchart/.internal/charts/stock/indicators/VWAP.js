import { Indicator } from "./Indicator";
import { LineSeries } from "../../xy/series/LineSeries";
import * as $array from "../../../core/util/Array";
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export class VWAP extends Indicator {
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
        super._afterNew();
        const stockSeries = this.get("stockSeries");
        const chart = stockSeries.chart;
        if (chart) {
            const series = chart.series.push(LineSeries.new(this._root, {
                valueXField: "valueX",
                valueYField: "vwap",
                groupDataDisabled: true,
                calculateAggregates: true,
                xAxis: stockSeries.get("xAxis"),
                yAxis: stockSeries.get("yAxis"),
                themeTags: ["indicator", "vwap"],
                name: "VWAP"
            }));
            series.setPrivate("baseValueSeries", stockSeries);
            this.series = series;
            this._handleLegend(series);
        }
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
            let period = this.get("period", Infinity);
            const stockSeries = this.get("stockSeries");
            const volumeSeries = this.get("volumeSeries");
            const dataItems = stockSeries.dataItems;
            if (volumeSeries) {
                let data = this._getDataArray(dataItems);
                let i = 0;
                let totalVolume = 0;
                let totalVW = 0;
                $array.each(data, (dataItem) => {
                    const volumeDI = volumeSeries.dataItems[i];
                    const volume = volumeDI.get("valueY", 0);
                    const vw = dataItem.value_y * volume;
                    dataItem.vw = vw;
                    dataItem.volume = volume;
                    totalVW += vw;
                    totalVolume += volume;
                    if (i >= period) {
                        let volumeToRemove = data[i - period].volume;
                        let vwToRemove = data[i - period].vw;
                        if (volumeToRemove != null) {
                            totalVolume -= volumeToRemove;
                        }
                        if (vwToRemove != null) {
                            totalVW -= vwToRemove;
                        }
                    }
                    dataItem.totalVW = totalVW;
                    dataItem.vwap = totalVW / totalVolume;
                    i++;
                });
                this.series.data.setAll(data);
            }
        }
    }
}
Object.defineProperty(VWAP, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "VWAP"
});
Object.defineProperty(VWAP, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Indicator.classNames.concat([VWAP.className])
});
//# sourceMappingURL=VWAP.js.map