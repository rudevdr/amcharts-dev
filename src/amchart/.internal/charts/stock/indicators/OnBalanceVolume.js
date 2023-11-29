import { ChartIndicator } from "./ChartIndicator";
import { LineSeries } from "../../xy/series/LineSeries";
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export class OnBalanceVolume extends ChartIndicator {
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
                }]
        });
    }
    _afterNew() {
        this._themeTags.push("onbalancevolume");
        super._afterNew();
        this.yAxis.set("numberFormat", "#.###a");
    }
    _createSeries() {
        return this.panel.series.push(LineSeries.new(this._root, {
            themeTags: ["indicator"],
            xAxis: this.xAxis,
            yAxis: this.yAxis,
            valueXField: "valueX",
            valueYField: "obv",
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
            this.setRaw("field", "close");
            const dataItems = this.get("stockSeries").dataItems;
            const volumeSeries = this.get("volumeSeries");
            let data = this._getDataArray(dataItems);
            let previous = 0;
            let len = data.length;
            if (volumeSeries && len > 1) {
                let cy = data[0].value_y;
                for (let i = 1; i < len; i++) {
                    const dataItem = data[i];
                    let c = dataItem.value_y;
                    if (c != null) {
                        const volumeDI = volumeSeries.dataItems[i];
                        let volume = 0;
                        if (volumeDI) {
                            volume = volumeDI.get("valueY", 1);
                        }
                        let obv = previous;
                        if (c > cy) {
                            obv += volume;
                        }
                        else if (c < cy) {
                            obv -= volume;
                        }
                        dataItem.obv = obv;
                        previous = obv;
                        cy = c;
                    }
                }
            }
            this.series.data.setAll(data);
        }
    }
}
Object.defineProperty(OnBalanceVolume, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "OnBalanceVolume"
});
Object.defineProperty(OnBalanceVolume, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: ChartIndicator.classNames.concat([OnBalanceVolume.className])
});
//# sourceMappingURL=OnBalanceVolume.js.map