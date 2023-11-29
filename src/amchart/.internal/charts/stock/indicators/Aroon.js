import { Color } from "../../../core/util/Color";
import { ChartIndicator } from "./ChartIndicator";
import { LineSeries } from "../../xy/series/LineSeries";
import * as $array from "../../../core/util/Array";
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export class Aroon extends ChartIndicator {
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
                    key: "upColor",
                    name: this.root.language.translateAny("Aroon up"),
                    type: "color"
                }, {
                    key: "downColor",
                    name: this.root.language.translateAny("Aroon down"),
                    type: "color"
                }]
        });
    }
    _createSeries() {
        return this.panel.series.push(LineSeries.new(this._root, {
            themeTags: ["indicator"],
            xAxis: this.xAxis,
            yAxis: this.yAxis,
            valueXField: "valueX",
            valueYField: "up",
            fill: undefined
        }));
    }
    _afterNew() {
        this._themeTags.push("aroon");
        super._afterNew();
        this.downSeries = this.panel.series.push(LineSeries.new(this._root, {
            themeTags: ["indicator"],
            xAxis: this.xAxis,
            yAxis: this.yAxis,
            valueXField: "valueX",
            valueYField: "down",
            fill: undefined
        }));
        this.yAxis.setAll({ min: -1, max: 101, strictMinMax: true, numberFormat: "#'%'" });
    }
    _updateChildren() {
        super._updateChildren();
        if (this.isDirty("upColor")) {
            let color = this.get("upColor", Color.fromHex(0x00ff00));
            this._updateSeriesColor(this.series, color);
            this.setCustomData("upColor", color);
        }
        if (this.isDirty("downColor")) {
            let color = this.get("downColor", Color.fromHex(0xff0000));
            this._updateSeriesColor(this.downSeries, color);
            this.setCustomData("downColor", color);
        }
    }
    /**
     * @ignore
     */
    prepareData() {
        if (this.series) {
            this.set("field", "close");
            const dataItems = this.get("stockSeries").dataItems;
            let data = this._getDataArray(dataItems);
            let period = this.get("period", 14);
            let i = 0;
            $array.each(data, (dataItem) => {
                let b = Math.max(0, i - period);
                let h = -Infinity;
                let l = Infinity;
                let li = 0;
                let hi = 0;
                for (let j = b; j <= i; j++) {
                    let vh = dataItems[j].get("highValueY", 0);
                    if (vh >= h) {
                        h = vh;
                        hi = j;
                    }
                    let vl = dataItems[j].get("lowValueY", 0);
                    if (vl <= l) {
                        l = vl;
                        li = j;
                    }
                }
                dataItem.up = (period - (i - hi)) / period * 100;
                dataItem.down = (period - (i - li)) / period * 100;
                i++;
            });
            this.series.data.setAll(data);
            this.downSeries.data.setAll(data);
        }
    }
}
Object.defineProperty(Aroon, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Aroon"
});
Object.defineProperty(Aroon, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: ChartIndicator.classNames.concat([Aroon.className])
});
//# sourceMappingURL=Aroon.js.map