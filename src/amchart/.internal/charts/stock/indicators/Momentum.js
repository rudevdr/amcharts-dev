import { ChartIndicator } from "./ChartIndicator";
import { LineSeries } from "../../xy/series/LineSeries";
import * as $array from "../../../core/util/Array";
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 * @since 5.4.8
 */
export class Momentum extends ChartIndicator {
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
                    key: "seriesColor",
                    name: this.root.language.translateAny("Color"),
                    type: "color"
                }
            ]
        });
    }
    _afterNew() {
        this._themeTags.push("momentum");
        super._afterNew();
    }
    _createSeries() {
        return this.panel.series.push(LineSeries.new(this._root, {
            themeTags: ["indicator"],
            xAxis: this.xAxis,
            yAxis: this.yAxis,
            valueXField: "valueX",
            valueYField: "valueY",
            stroke: this.get("seriesColor"),
            fill: undefined
        }));
    }
    /**
     * @ignore
     */
    prepareData() {
        if (this.series) {
            const dataItems = this.get("stockSeries").dataItems;
            const period = this.get("period", 14);
            const data = [];
            let i = 0;
            $array.each(dataItems, (dataItem) => {
                if (i > period) {
                    let value = this._getValue(dataItem);
                    let prevValue = this._getValue(dataItems[i - period]);
                    if (value != undefined && prevValue != undefined) {
                        data.push({ valueX: dataItem.get("valueX"), valueY: value - prevValue });
                    }
                }
                else {
                    data.push({ valueX: dataItem.get("valueX") });
                }
                i++;
            });
            this.series.data.setAll(data);
        }
    }
}
Object.defineProperty(Momentum, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Momentum"
});
Object.defineProperty(Momentum, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: ChartIndicator.classNames.concat([Momentum.className])
});
//# sourceMappingURL=Momentum.js.map