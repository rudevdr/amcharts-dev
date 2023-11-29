import { ChartIndicator } from "./ChartIndicator";
import { LineSeries } from "../../xy/series/LineSeries";
import * as $array from "../../../core/util/Array";
import * as $type from "../../../core/util/Type";
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export class Trix extends ChartIndicator {
    constructor() {
        super(...arguments);
        /**
         * Indicator series for the signal.
         */
        Object.defineProperty(this, "signalSeries", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
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
                    key: "signalPeriod",
                    name: this.root.language.translateAny("Signal period"),
                    type: "number"
                }, {
                    key: "signalColor",
                    name: this.root.language.translateAny("Signal color"),
                    type: "color"
                }]
        });
        Object.defineProperty(this, "_themeTag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "trix"
        });
    }
    _createSeries() {
        return this.panel.series.push(LineSeries.new(this._root, {
            themeTags: ["indicator"],
            xAxis: this.xAxis,
            yAxis: this.yAxis,
            valueXField: "valueX",
            valueYField: "trix",
            fill: undefined
        }));
    }
    _afterNew() {
        this._themeTags.push("trix");
        super._afterNew();
        const chart = this.panel;
        if (chart) {
            const signalSeries = chart.series.push(LineSeries.new(this._root, {
                valueXField: "valueX",
                valueYField: "signal",
                xAxis: this.xAxis,
                yAxis: this.yAxis,
                groupDataDisabled: true,
                themeTags: ["indicator", "signal"]
            }));
            this.signalSeries = signalSeries;
        }
    }
    _prepareChildren() {
        if (this.isDirty("signalPeriod")) {
            this._dataDirty = true;
            this.setCustomData("signalPeriod", this.get("signalPeriod"));
        }
        super._prepareChildren();
    }
    _updateChildren() {
        super._updateChildren();
        if (this.isDirty("signalColor")) {
            this._updateSeriesColor(this.signalSeries, this.get("signalColor"), "signalColor");
        }
        const dataItem = this.series.dataItem;
        if (dataItem) {
            const dataContext = dataItem.dataContext;
            if (dataContext) {
                dataContext.signalPeriod = this.get("signalPeriod");
                const signalColor = this.get("signalColor");
                if (signalColor) {
                    dataContext.signalColor = signalColor.toCSSHex();
                }
            }
        }
    }
    /**
     * @ignore
     */
    prepareData() {
        super.prepareData();
        if (this.series) {
            let period = this.get("period", 14);
            const stockSeries = this.get("stockSeries");
            const dataItems = stockSeries.dataItems;
            let data = this._getDataArray(dataItems);
            this._ema(data, period, "value_y", "ema");
            this._ema(data, period, "ema", "ema2");
            this._ema(data, period, "ema2", "ema3");
            let previousDataItem;
            let previousValue;
            $array.each(data, (dataItem) => {
                let value = dataItem.ema3;
                if (previousDataItem) {
                    previousValue = previousDataItem.ema3;
                }
                if ($type.isNumber(value) && $type.isNumber(previousValue)) {
                    dataItem.trix = 100 * (value - previousValue) / previousValue;
                }
                previousDataItem = dataItem;
            });
            this.series.data.setAll(data);
            period = this.get("signalPeriod", 9);
            this._sma(data, period, "trix", "signal");
            this.signalSeries.data.setAll(data);
        }
    }
}
Object.defineProperty(Trix, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Trix"
});
Object.defineProperty(Trix, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: ChartIndicator.classNames.concat([Trix.className])
});
//# sourceMappingURL=Trix.js.map