import { Color } from "../../../core/util/Color";
import { ChartIndicator } from "./ChartIndicator";
import { ColumnSeries } from "../../xy/series/ColumnSeries";
import * as $array from "../../../core/util/Array";
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export class AwesomeOscillator extends ChartIndicator {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_editableSettings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [{
                    key: "increasingColor",
                    name: this.root.language.translateAny("Increasing"),
                    type: "color"
                }, {
                    key: "decreasingColor",
                    name: this.root.language.translateAny("Decreasing"),
                    type: "color"
                }]
        });
    }
    _afterNew() {
        this._themeTags.push("awesomeoscillator");
        super._afterNew();
    }
    _createSeries() {
        return this.panel.series.push(ColumnSeries.new(this._root, {
            themeTags: ["indicator"],
            xAxis: this.xAxis,
            yAxis: this.yAxis,
            valueXField: "valueX",
            valueYField: "ao",
            stroke: this.get("seriesColor"),
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
            this._dataDirty = true;
        }
    }
    /**
     * @ignore
     */
    prepareData() {
        if (this.series) {
            this.set("field", "hl/2");
            const dataItems = this.get("stockSeries").dataItems;
            let decreasingColor = this.get("decreasingColor", Color.fromHex(0xff0000)).toCSSHex();
            let increasingColor = this.get("increasingColor", Color.fromHex(0x00ff00)).toCSSHex();
            let data = this._getDataArray(dataItems);
            let period = 5;
            this._sma(data, 5, "value_y", "sma5");
            period = 34;
            this._sma(data, 34, "value_y", "sma34");
            let po = -Infinity;
            let i = 0;
            $array.each(data, (dataItem) => {
                i++;
                if (i >= period) {
                    let o = dataItem.sma5 - dataItem.sma34;
                    let color = increasingColor;
                    if (o < po) {
                        color = decreasingColor;
                    }
                    dataItem.ao = o;
                    dataItem.oscillatorColor = color;
                    po = o;
                }
            });
            this.series.data.setAll(data);
        }
    }
}
Object.defineProperty(AwesomeOscillator, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "AwesomeOscillator"
});
Object.defineProperty(AwesomeOscillator, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: ChartIndicator.classNames.concat([AwesomeOscillator.className])
});
//# sourceMappingURL=AwesomeOscillator.js.map