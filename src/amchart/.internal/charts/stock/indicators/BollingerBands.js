import { __awaiter } from "tslib";
import { MovingAverage } from "./MovingAverage";
import { LineSeries } from "../../xy/series/LineSeries";
import * as $array from "../../../core/util/Array";
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export class BollingerBands extends MovingAverage {
    constructor() {
        super(...arguments);
        /**
         * Indicator series for the upper band.
         */
        Object.defineProperty(this, "upperBandSeries", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Indicator series for the lower band.
         */
        Object.defineProperty(this, "lowerBandSeries", {
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
                    key: "standardDeviations",
                    name: this.root.language.translateAny("Deviation"),
                    type: "number"
                }, {
                    key: "upperColor",
                    name: this.root.language.translateAny("Upper"),
                    type: "color"
                }, {
                    key: "seriesColor",
                    name: this.root.language.translateAny("Average"),
                    type: "color"
                }, {
                    key: "lowerColor",
                    name: this.root.language.translateAny("Lower"),
                    type: "color"
                }, {
                    key: "field",
                    name: this.root.language.translateAny("Field"),
                    type: "dropdown",
                    options: ["open", "close", "low", "high", "hl/2", "hlc/3", "hlcc/4", "ohlc/4"]
                }, {
                    key: "type",
                    name: this.root.language.translateAny("Type"),
                    type: "dropdown",
                    options: ["simple", "weighted", "exponential", "dema", "tema"]
                }]
        });
    }
    _afterNew() {
        const stockSeries = this.get("stockSeries");
        const chart = stockSeries.chart;
        if (chart) {
            const upperBandSeries = chart.series.push(LineSeries.new(this._root, {
                valueXField: "valueX",
                valueYField: "upper",
                openValueYField: "lower",
                calculateAggregates: true,
                xAxis: stockSeries.get("xAxis"),
                yAxis: stockSeries.get("yAxis"),
                groupDataDisabled: true,
                themeTags: ["indicator", "bollingerbands", "upper"]
            }));
            upperBandSeries.fills.template.set("visible", true);
            upperBandSeries.setPrivate("baseValueSeries", stockSeries);
            this.upperBandSeries = upperBandSeries;
            const lowerBandSeries = chart.series.push(LineSeries.new(this._root, {
                valueXField: "valueX",
                valueYField: "lower",
                calculateAggregates: true,
                xAxis: stockSeries.get("xAxis"),
                yAxis: stockSeries.get("yAxis"),
                groupDataDisabled: true,
                themeTags: ["indicator", "bollingerbands", "lower"]
            }));
            lowerBandSeries.setPrivate("baseValueSeries", stockSeries);
            this.lowerBandSeries = lowerBandSeries;
        }
        super._afterNew();
        this.series.addTag("bollingerbands");
        this.series._applyThemes();
    }
    _prepareChildren() {
        if (this.isDirty("standardDeviations")) {
            this._dataDirty = true;
        }
        super._prepareChildren();
    }
    _updateChildren() {
        super._updateChildren();
        if (this.isDirty("upperColor")) {
            const color = this.get("upperColor");
            const upperBandSeries = this.upperBandSeries;
            upperBandSeries.set("stroke", color);
            upperBandSeries.set("fill", color);
            upperBandSeries.strokes.template.set("stroke", color);
            this._updateSeriesColor(upperBandSeries, color, "upperColor");
        }
        if (this.isDirty("lowerColor")) {
            const color = this.get("lowerColor");
            const lowerBandSeries = this.lowerBandSeries;
            lowerBandSeries.set("stroke", color);
            lowerBandSeries.strokes.template.set("stroke", color);
            this._updateSeriesColor(lowerBandSeries, color, "lowerColor");
        }
        this.setCustomData("standardDeviations", this.get("standardDeviations"));
    }
    /**
     * @ignore
     */
    prepareData() {
        super.prepareData();
        if (this.series) {
            let period = this.get("period", 20);
            const stockSeries = this.get("stockSeries");
            const dataItems = stockSeries.dataItems;
            let standardDeviations = this.get("standardDeviations", 2);
            let smaData = this.series.data.values;
            let i = 0;
            $array.each(smaData, (dataItem) => {
                if (i >= period - 1) {
                    let mean = dataItem.ma;
                    let stdSum = 0;
                    for (let j = i - period + 1; j <= i; j++) {
                        let di = dataItems[j];
                        let diValue = this._getValue(di);
                        if (diValue != null) {
                            stdSum += Math.pow(diValue - mean, 2);
                        }
                    }
                    let std = Math.sqrt(stdSum / period);
                    const lower = mean - standardDeviations * std;
                    const upper = mean + standardDeviations * std;
                    dataItem.upper = upper;
                    dataItem.lower = lower;
                }
                i++;
            });
            this.upperBandSeries.data.setAll(smaData);
            this.lowerBandSeries.data.setAll(smaData);
        }
    }
    _dispose() {
        this.upperBandSeries.dispose();
        this.lowerBandSeries.dispose();
        super._dispose();
    }
    hide(duration) {
        const _super = Object.create(null, {
            hide: { get: () => super.hide }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all([
                _super.hide.call(this, duration),
                this.upperBandSeries.hide(duration),
                this.lowerBandSeries.hide(duration)
            ]);
        });
    }
    show(duration) {
        const _super = Object.create(null, {
            show: { get: () => super.show }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all([
                _super.show.call(this, duration),
                this.upperBandSeries.show(duration),
                this.lowerBandSeries.show(duration)
            ]);
        });
    }
}
Object.defineProperty(BollingerBands, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "BollingerBands"
});
Object.defineProperty(BollingerBands, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: MovingAverage.classNames.concat([BollingerBands.className])
});
//# sourceMappingURL=BollingerBands.js.map